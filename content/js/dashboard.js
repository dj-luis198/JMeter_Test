/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.66666666666667, "KoPercent": 3.3333333333333335};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7121212121212122, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c18c9189-7ed4-4262-9999-258b5685d081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9f359a5-edcf-4d53-ab92-23cdbc9808aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c95ab6b-72a4-4afe-a740-08f9050bdab0"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9360c92-fb56-4c99-908d-8d580ba536a3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ab683b1-5afc-4c90-b0ad-3e8a11161107"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bb992917-39e5-47ad-b522-c22dcb73ac86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbd957c8-fbd1-4ff2-af20-2148ec4c4b76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/daaa0d80-429d-437c-80aa-6f00120516ee"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8192cc2d-d305-43ba-875b-f3a583723d96"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4b4f88e-5733-4547-b8ad-7addeb8f36af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/663d4aef-8c91-477b-8b7a-9308be4a4961"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4922e051-0600-4a52-9a73-6d1db4315ecc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60be5a02-13db-47d3-926a-1537e6ea39e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6c324a9-04bd-4d83-8ced-9d80e00fc418"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/364aef07-ee03-4982-b0ff-b716b12457a8"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9360c92-fb56-4c99-908d-8d580ba536a3"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4922e051-0600-4a52-9a73-6d1db4315ecc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3090909090909091, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daaa0d80-429d-437c-80aa-6f00120516ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03631194-b067-4b29-9eb2-64e8fa5e035e"], "isController": false}, {"data": [0.19811320754716982, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c18c9189-7ed4-4262-9999-258b5685d081"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c9f359a5-edcf-4d53-ab92-23cdbc9808aa"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4636363636363636, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8850931677018633, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ab683b1-5afc-4c90-b0ad-3e8a11161107"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60be5a02-13db-47d3-926a-1537e6ea39e3"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03631194-b067-4b29-9eb2-64e8fa5e035e"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb992917-39e5-47ad-b522-c22dcb73ac86"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c4b4f88e-5733-4547-b8ad-7addeb8f36af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6c324a9-04bd-4d83-8ced-9d80e00fc418"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=364aef07-ee03-4982-b0ff-b716b12457a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbd957c8-fbd1-4ff2-af20-2148ec4c4b76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 43, 3.3333333333333335, 461.786821705426, 126, 3411, 154.0, 1284.4000000000015, 1515.8000000000002, 1986.3599999999997, 5.034971585586711, 731.6748585072967, 3.672099579492053], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2133.254545454546, 1732, 2953, 2102.0, 2490.4, 2633.6, 2953.0, 0.25559877498478023, 307.57051984724484, 1.256777179734735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c18c9189-7ed4-4262-9999-258b5685d081", 3, 0, 0.0, 394.66666666666663, 234, 653, 297.0, 653.0, 653.0, 653.0, 0.04155815370975786, 0.027204898147891614, 0.026650248309968413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9f359a5-edcf-4d53-ab92-23cdbc9808aa", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c95ab6b-72a4-4afe-a740-08f9050bdab0", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 615.7058823529412, 142, 1263, 567.0, 1192.6, 1263.0, 1263.0, 0.10100890066665874, 0.020964220939145108, 0.06751720864873859], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 615.7058823529412, 142, 1263, 567.0, 1192.6, 1263.0, 1263.0, 0.09831135785334258, 0.02040435063902383, 0.0657140946680546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 214.4375, 128, 395, 136.5, 395.0, 395.0, 395.0, 0.09284727783387302, 0.0248439005141418, 0.0529519631396307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 156.12500000000003, 130, 476, 134.0, 243.60000000000025, 476.0, 476.0, 0.09284512272964661, 0.06899915859107526, 0.046603899495154644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 241.25, 130, 523, 142.0, 437.6000000000001, 523.0, 523.0, 0.09284673904843699, 0.02502509763414903, 0.05467439809199951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 182.75, 130, 395, 134.0, 395.0, 395.0, 395.0, 0.09284566149632388, 0.02502480720018105, 0.054583093965612284], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 281.0, 130, 527, 234.0, 511.0, 527.0, 527.0, 0.1007204474357759, 0.13768637911472653, 0.06509105202507347], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 135.11111111111111, 129, 148, 134.0, 144.4, 148.0, 148.0, 0.08328243850979956, 0.06189251533784909, 0.04180388026761424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 164.83333333333334, 131, 401, 132.5, 397.4, 401.0, 401.0, 0.08328706274292061, 0.029235421872108088, 0.04711105230890246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 939.7777777777778, 633, 1171, 1034.0, 1171.0, 1171.0, 1171.0, 0.06672795753136214, 19.620235090935378, 0.03805578827960497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1313.6666666666667, 1013, 1688, 1306.0, 1688.0, 1688.0, 1688.0, 0.06640988179041042, 59.75572837113163, 0.037809532308407494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 248.55555555555554, 131, 400, 134.0, 400.0, 400.0, 400.0, 0.06691499565052529, 0.11840817589721857, 0.03705156497446078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 136.10000000000002, 131, 147, 134.5, 146.7, 147.0, 147.0, 0.05401959831026697, 0.04014542413487614, 0.027115306183083224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 132.3, 130, 135, 132.0, 134.9, 135.0, 135.0, 0.05401872288935345, 0.014454228585627778, 0.03080755289783439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 132.2, 129, 136, 132.0, 135.8, 136.0, 136.0, 0.05401872288935345, 0.014559733903771046, 0.031757100761123806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 133.5, 131, 138, 132.5, 137.9, 138.0, 138.0, 0.05401872288935345, 0.014559733903771046, 0.03180985342019544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 162.44444444444446, 129, 394, 134.0, 394.0, 394.0, 394.0, 0.06704759634367108, 0.049827364079622745, 0.037648796775010616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 244.44444444444443, 129, 1318, 133.0, 730.3000000000009, 1318.0, 1318.0, 0.08328667737054705, 4.184617825488962, 0.0485658207670703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 918.8823529411765, 130, 1820, 1189.0, 1734.3999999999999, 1820.0, 1820.0, 0.14187948589550992, 75.1118702793774, 0.07623740297946921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 229.44444444444446, 131, 1053, 134.0, 467.10000000000093, 1053.0, 1053.0, 0.08328667737054705, 1.381703926851162, 0.04864715541293997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 672.1176470588235, 128, 1161, 1013.0, 1077.8, 1161.0, 1161.0, 0.1418830383000743, 24.555937387849806, 0.07637786948012386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9360c92-fb56-4c99-908d-8d580ba536a3", 3, 0, 0.0, 391.6666666666667, 329, 470, 376.0, 470.0, 470.0, 470.0, 0.028331822302810516, 0.02841482568846328, 0.01816851885954971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ab683b1-5afc-4c90-b0ad-3e8a11161107", 3, 0, 0.0, 446.66666666666663, 257, 725, 358.0, 725.0, 725.0, 725.0, 0.030970619205913326, 0.03106135344186815, 0.01986071609233374], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 500.70588235294105, 133, 1655, 330.0, 1242.9999999999995, 1655.0, 1655.0, 0.09864393600909845, 0.0204733766544619, 0.06635572671567917], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 270.7, 265, 286, 269.0, 285.2, 286.0, 286.0, 0.05398052382700322, 0.08365926886079503, 0.12140346325545742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb992917-39e5-47ad-b522-c22dcb73ac86", 3, 0, 0.0, 714.0, 279, 1055, 808.0, 1055.0, 1055.0, 1055.0, 0.028196813760045115, 0.02827942161285775, 0.01808194111565393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbd957c8-fbd1-4ff2-af20-2148ec4c4b76", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 0.6251351643598616, 2.3856509515570936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daaa0d80-429d-437c-80aa-6f00120516ee", 3, 0, 0.0, 358.3333333333333, 257, 499, 319.0, 499.0, 499.0, 499.0, 0.07954183900731784, 0.03599061074875384, 0.05100827566550005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 618.88, 151, 1393, 650.0, 1043.4000000000003, 1311.6999999999998, 1393.0, 0.10498026371042243, 0.06448494714243723, 0.047466662205005464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 149.7058823529412, 130, 392, 134.0, 197.59999999999982, 392.0, 392.0, 0.14187474963279476, 0.10543621530327814, 0.07121447393677394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 196.3529411764706, 131, 401, 134.0, 400.2, 401.0, 401.0, 0.1418830383000743, 0.16331872251016133, 0.07390828304831536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8192cc2d-d305-43ba-875b-f3a583723d96", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["login", 25, 0, 0.0, 3056.0, 1847, 4711, 2862.0, 4370.6, 4660.9, 4711.0, 0.1046857334282484, 45.22647368069804, 0.22044116530924165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 154.94444444444443, 134, 401, 139.0, 180.50000000000034, 401.0, 401.0, 0.08541857474362564, 0.06915234224850161, 0.030363633990898177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4b4f88e-5733-4547-b8ad-7addeb8f36af", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/663d4aef-8c91-477b-8b7a-9308be4a4961", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.5184024959415584, 0.9686358563311689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4922e051-0600-4a52-9a73-6d1db4315ecc", 3, 0, 0.0, 1059.3333333333333, 225, 2316, 637.0, 2316.0, 2316.0, 2316.0, 0.020984156961494072, 0.024802563127338858, 0.013456637113978945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1069.5882352941178, 266, 1958, 1324.0, 1867.6, 1958.0, 1958.0, 0.14171626736024276, 99.82098063749396, 0.29739412700695245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60be5a02-13db-47d3-926a-1537e6ea39e3", 3, 0, 0.0, 406.0, 220, 502, 496.0, 502.0, 502.0, 502.0, 0.0342806211648555, 0.028578343360415023, 0.021983341046473093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6c324a9-04bd-4d83-8ced-9d80e00fc418", 3, 0, 0.0, 449.6666666666667, 225, 635, 489.0, 635.0, 635.0, 635.0, 0.08465250148141877, 0.03747636784333644, 0.05428562106718587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 463.1875, 264, 871, 529.0, 720.5000000000001, 871.0, 871.0, 0.09277244658336474, 0.14377917258574202, 0.2086474067202041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 854.4117647058823, 130, 1823, 1173.0, 1738.1999999999998, 1823.0, 1823.0, 0.12041280342255686, 76.27987853358454, 0.1812901634249651], "isController": false}, {"data": ["register", 27, 9, 33.333333333333336, 1216.5555555555554, 201, 3411, 1137.0, 2203.2, 2977.7999999999975, 3411.0, 0.10934228590172963, 0.03416946434429051, 0.049332164147069424], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/364aef07-ee03-4982-b0ff-b716b12457a8", 3, 0, 0.0, 367.6666666666667, 230, 502, 371.0, 502.0, 502.0, 502.0, 0.08464055975623518, 0.03829764910845277, 0.05427796312492946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 411.38888888888886, 264, 1453, 271.0, 865.3000000000009, 1453.0, 1453.0, 0.08323083609998798, 5.653659548599872, 0.18600502390574572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 140.23076923076923, 134, 150, 138.0, 150.0, 150.0, 150.0, 0.06214446197236961, 0.048246921160189304, 0.022090414216740763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9360c92-fb56-4c99-908d-8d580ba536a3", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 526.0952380952382, 266, 1951, 519.0, 1343.2000000000007, 1907.6999999999994, 1951.0, 0.10320526051956477, 11.903702619263507, 0.22959618945291382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4922e051-0600-4a52-9a73-6d1db4315ecc", 1, 0, 0.0, 1005.0, 1005, 1005, 1005.0, 1005.0, 1005.0, 1005.0, 0.9950248756218905, 0.179765236318408, 0.6860230099502488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 134.8888888888889, 133, 138, 134.0, 138.0, 138.0, 138.0, 0.04549452549209912, 0.033809896386218195, 0.022836119241151316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 160.88888888888889, 130, 392, 132.0, 392.0, 392.0, 392.0, 0.0454361873990307, 0.01215772983138126, 0.025912825626009692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 132.88888888888886, 130, 135, 133.0, 135.0, 135.0, 135.0, 0.04549613535605781, 0.012262630232687458, 0.026746751449557425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 161.55555555555554, 129, 395, 133.0, 395.0, 395.0, 395.0, 0.04549613535605781, 0.012262630232687458, 0.026791181269241075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 141.0, 133, 154, 138.5, 154.0, 154.0, 154.0, 0.06477732793522267, 0.01910425101214575, 0.04004301619433198], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1449.2181818181818, 1040, 2372, 1332.0, 1898.9999999999998, 2084.0, 2372.0, 0.2388697551802164, 285.7712717588631, 0.47167445798281005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 9, 33.333333333333336, 1216.5555555555554, 201, 3411, 1137.0, 2203.2, 2977.7999999999975, 3411.0, 0.10538312620995441, 0.03293222694061075, 0.047545902645506774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 198.0, 130, 396, 133.0, 396.0, 396.0, 396.0, 0.03638149637094574, 0.00980595019373147, 0.021423869445000274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 264.5, 130, 399, 264.5, 399.0, 399.0, 399.0, 0.03646973012399708, 0.009829731947483588, 0.021440212436177972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 297.2307692307692, 131, 1457, 134.0, 1036.1999999999996, 1457.0, 1457.0, 0.060037592769626516, 4.170470430619634, 0.03489865481155123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 266.6153846153846, 130, 791, 141.0, 636.1999999999998, 791.0, 791.0, 0.06003676097056351, 1.3728448101683801, 0.03495680095273722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 154.07692307692307, 131, 399, 134.0, 294.19999999999993, 399.0, 399.0, 0.0601083800329209, 0.044670387895559376, 0.030171589196212246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 264.0, 131, 398, 263.5, 398.0, 398.0, 398.0, 0.03638083457634518, 0.009734715501873614, 0.020748444719321864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 172.15384615384613, 130, 396, 132.0, 393.6, 396.0, 396.0, 0.06010921381772112, 0.02302862007740217, 0.03389271025509426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 196.75, 132, 391, 132.0, 391.0, 391.0, 391.0, 0.03638348189921776, 0.027038896216117884, 0.018262802437693286], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 508.7058823529413, 133, 1055, 502.0, 844.5999999999998, 1055.0, 1055.0, 0.10117060339338106, 0.02034686824909393, 0.06883994698957943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 138.25, 135, 142, 138.0, 142.0, 142.0, 142.0, 0.03499317633061553, 0.027543457150855582, 0.012438980648773489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1553.72, 926, 3098, 1455.0, 2158.6000000000004, 2833.0999999999995, 3098.0, 0.10598115231187286, 0.05485352609891857, 0.048747190174699334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 529.25, 267, 788, 531.0, 788.0, 788.0, 788.0, 0.036251914554237395, 0.05618338710700659, 0.08153140548672727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daaa0d80-429d-437c-80aa-6f00120516ee", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03631194-b067-4b29-9eb2-64e8fa5e035e", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["addBook", 53, 18, 33.9622641509434, 1277.735849056604, 672, 3109, 1042.0, 2374.2000000000003, 2678.7, 3109.0, 0.25844329364034446, 82.77077916081511, 0.936242641375796], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 225.80000000000007, 130, 573, 134.0, 533.2, 537.0, 573.0, 0.23982279275822374, 0.17822768094629712, 0.11592996329621166], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 852.381818181818, 647, 1221, 786.0, 1093.0, 1189.9999999999998, 1221.0, 0.23962740117548134, 70.45841232414617, 0.12051573398962195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c18c9189-7ed4-4262-9999-258b5685d081", 1, 0, 0.0, 1655.0, 1655, 1655, 1655.0, 1655.0, 1655.0, 1655.0, 0.6042296072507553, 0.1091625755287009, 0.4165879909365559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9f359a5-edcf-4d53-ab92-23cdbc9808aa", 3, 0, 0.0, 655.6666666666666, 527, 792, 648.0, 792.0, 792.0, 792.0, 0.06288385352254386, 0.027839205986542857, 0.0403259086716834], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 248.67272727272726, 128, 535, 143.0, 401.4, 410.0, 535.0, 0.24030164410015772, 0.42522126866160725, 0.11686544800964703], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1219.8545454545451, 906, 1858, 1187.0, 1456.0, 1565.7999999999997, 1858.0, 0.23949384065386173, 215.49697880561155, 0.12021468173445793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 142.42857142857144, 131, 180, 138.0, 157.0, 177.79999999999995, 180.0, 0.10205073379337157, 0.0762390735858684, 0.03627584677811255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 18, 11.180124223602485, 185.6708074534161, 130, 1325, 139.0, 292.6, 391.9, 791.7999999999961, 0.6664817628235644, 1.5683084299593901, 0.3151380491747631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 198.33333333333334, 135, 406, 139.0, 406.0, 406.0, 406.0, 0.04454034365349592, 0.03449266847384987, 0.015832700283078628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ab683b1-5afc-4c90-b0ad-3e8a11161107", 1, 0, 0.0, 1140.0, 1140, 1140, 1140.0, 1140.0, 1140.0, 1140.0, 0.8771929824561404, 0.15847724780701755, 0.6047834429824562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 138.5625, 133, 153, 137.5, 146.0, 153.0, 153.0, 0.09591636093326619, 0.07783837493705488, 0.03409526892549696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60be5a02-13db-47d3-926a-1537e6ea39e3", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 327.1111111111111, 266, 531, 269.0, 531.0, 531.0, 531.0, 0.045404554581319555, 0.07036819152397865, 0.1021159074226357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03631194-b067-4b29-9eb2-64e8fa5e035e", 3, 0, 0.0, 390.6666666666667, 323, 506, 343.0, 506.0, 506.0, 506.0, 0.059918510825277625, 0.02711156577055205, 0.03842430544459535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 491.84615384615387, 264, 1856, 279.0, 1329.1999999999994, 1856.0, 1856.0, 0.05999990769244971, 5.607431277028804, 0.13376031104182917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb992917-39e5-47ad-b522-c22dcb73ac86", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4b4f88e-5733-4547-b8ad-7addeb8f36af", 3, 0, 0.0, 541.0, 337, 779, 507.0, 779.0, 779.0, 779.0, 0.019576239665376808, 0.02313845254719505, 0.012553773483330831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6c324a9-04bd-4d83-8ced-9d80e00fc418", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 189.9, 135, 394, 138.0, 393.9, 394.0, 394.0, 0.05577804799143249, 0.046245666742896666, 0.01982735299695452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=364aef07-ee03-4982-b0ff-b716b12457a8", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.5474668560606061, 2.089251893939394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 187.23529411764707, 130, 404, 140.0, 395.2, 404.0, 404.0, 0.1483433537814466, 0.1151689123596192, 0.052731426539498596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbd957c8-fbd1-4ff2-af20-2148ec4c4b76", 3, 0, 0.0, 410.3333333333333, 319, 510, 402.0, 510.0, 510.0, 510.0, 0.08432414200185513, 0.038154478314641485, 0.05407505199988757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 146.14285714285714, 129, 393, 133.0, 141.6, 367.89999999999964, 393.0, 0.10340446904267157, 0.0768464852944073, 0.051904196374934757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 182.23809523809524, 126, 397, 134.0, 391.0, 396.4, 397.0, 0.10327276303818633, 0.04240599412328801, 0.058071719245617055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 298.6666666666667, 131, 1557, 134.0, 1186.8000000000006, 1539.6999999999998, 1557.0, 0.10340497821109387, 8.88654804330699, 0.05994449676243937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 299.952380952381, 132, 1055, 135.0, 731.4000000000002, 1028.0999999999997, 1055.0, 0.10327327091037847, 2.9171625422928633, 0.059968998040266744], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.930232558139537, 0.6976744186046512], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.30232558139535, 0.31007751937984496], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.30232558139535, 0.31007751937984496], "isController": false}, {"data": ["401/Unauthorized", 26, 60.46511627906977, 2.0155038759689923], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 43, "401/Unauthorized", 26, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
