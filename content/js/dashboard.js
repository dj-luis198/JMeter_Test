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

    var data = {"OkPercent": 97.0335675253708, "KoPercent": 2.966432474629196};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7093874833555259, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44e4a83d-37f4-44e4-a7ff-487cae11d709"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82265d5d-9e82-4f40-a1c5-a9435a919f26"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79c6f3bd-f319-4f8d-9416-a5d0992ccd8f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e05345f5-3a67-4c42-b0c6-4cc630da7731"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57ee09e5-7dd5-455b-b729-f03f745b7b18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7b7957f-0d0d-4939-bcbf-adbf15f10eb9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a583f41-4863-48c6-9668-b1dd3e0f885b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34a953fa-9f09-4b96-b069-f9636602bed8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9a583f41-4863-48c6-9668-b1dd3e0f885b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c7f5fe86-05e0-48c8-8aed-02dd7bfdb29d"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39a223a0-fe94-46a4-8988-6f2dfe8236fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53c48b54-4842-45ee-8331-e691087ba794"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5641e19e-ecb0-4ddb-b2c5-776413cb85e7"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64a53da6-a84a-4c73-b64f-737fe644d5f9"], "isController": false}, {"data": [0.475, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f1b73b7-f2d9-4465-b5a3-ec8a07031429"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08823529411764706, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efa42070-84ba-4879-bcde-34de0edc6b46"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e05345f5-3a67-4c42-b0c6-4cc630da7731"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/79c6f3bd-f319-4f8d-9416-a5d0992ccd8f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44e4a83d-37f4-44e4-a7ff-487cae11d709"], "isController": false}, {"data": [0.2358490566037736, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7b7957f-0d0d-4939-bcbf-adbf15f10eb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39a223a0-fe94-46a4-8988-6f2dfe8236fa"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7f5fe86-05e0-48c8-8aed-02dd7bfdb29d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34a953fa-9f09-4b96-b069-f9636602bed8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57ee09e5-7dd5-455b-b729-f03f745b7b18"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9006211180124224, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5641e19e-ecb0-4ddb-b2c5-776413cb85e7"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f1b73b7-f2d9-4465-b5a3-ec8a07031429"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efa42070-84ba-4879-bcde-34de0edc6b46"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 38, 2.966432474629196, 491.45120999219364, 140, 2565, 160.0, 1357.1999999999998, 1618.5999999999995, 2039.4200000000012, 4.943464670242736, 714.1884849665227, 3.61383523713966], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2365.9454545454546, 1761, 3184, 2363.0, 2830.2, 2940.2, 3184.0, 0.2469246655293167, 297.1328766863832, 1.2141266513087008], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44e4a83d-37f4-44e4-a7ff-487cae11d709", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82265d5d-9e82-4f40-a1c5-a9435a919f26", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 531.1875000000001, 147, 1074, 507.5, 1027.1000000000001, 1074.0, 1074.0, 0.11363071438209749, 0.023774785699574596, 0.07587402437378823], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 531.1875000000001, 147, 1074, 507.5, 1027.1000000000001, 1074.0, 1074.0, 0.11502020042269924, 0.02406550580133136, 0.07680181839748106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 200.0, 142, 444, 146.5, 440.5, 444.0, 444.0, 0.07719139123009307, 0.03514695914163173, 0.043212856467432476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 147.4375, 141, 160, 146.5, 155.8, 160.0, 160.0, 0.0771902740254728, 0.05736503763025859, 0.0387458992666924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 300.5625, 142, 1179, 144.0, 1076.8000000000002, 1179.0, 1179.0, 0.07710211693499809, 2.852006552475219, 0.044574661353045775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 390.125, 141, 1475, 149.5, 1323.1000000000001, 1475.0, 1475.0, 0.07699229595838566, 8.677883256220737, 0.044435983311919856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79c6f3bd-f319-4f8d-9416-a5d0992ccd8f", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e05345f5-3a67-4c42-b0c6-4cc630da7731", 1, 0, 0.0, 848.0, 848, 848, 848.0, 848.0, 848.0, 848.0, 1.1792452830188678, 0.21304724351415094, 0.813034345518868], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 354.9375, 141, 1265, 273.0, 724.6000000000006, 1265.0, 1265.0, 0.11383444203336772, 0.18853134671480914, 0.0735643964995909], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57ee09e5-7dd5-455b-b729-f03f745b7b18", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 148.12500000000003, 143, 155, 149.0, 152.9, 155.0, 155.0, 0.13658986332476802, 0.10150867772475436, 0.0685617087391902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 146.75, 142, 155, 147.0, 152.2, 155.0, 155.0, 0.13658286738657222, 0.03654658756242264, 0.07789491655640446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7b7957f-0d0d-4939-bcbf-adbf15f10eb9", 3, 0, 0.0, 432.3333333333333, 265, 560, 472.0, 560.0, 560.0, 560.0, 0.03500624277996242, 0.029183264244623624, 0.022448664803556635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 1132.3333333333333, 881, 1271, 1131.0, 1271.0, 1271.0, 1271.0, 0.05730950955795265, 16.85089866484762, 0.03268432966976987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1531.2222222222222, 1257, 1904, 1569.0, 1904.0, 1904.0, 1904.0, 0.057139229255285376, 51.41397892395721, 0.03253141665608533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 178.77777777777777, 141, 440, 148.0, 440.0, 440.0, 440.0, 0.05767123551010208, 0.10205105346123533, 0.031933193881081914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 198.45454545454547, 144, 437, 148.0, 434.40000000000003, 437.0, 437.0, 0.08181966944853543, 0.06080543793978072, 0.041069638766159385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 222.0, 141, 442, 146.0, 438.6, 442.0, 442.0, 0.08199165175909362, 0.021939172443351224, 0.046760863893858085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a583f41-4863-48c6-9668-b1dd3e0f885b", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 279.0, 143, 448, 148.0, 447.6, 448.0, 448.0, 0.08182088664088069, 0.022053285852424873, 0.0481017321853615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 198.8181818181818, 143, 445, 145.0, 442.0, 445.0, 445.0, 0.08199042948077698, 0.022098982945990667, 0.04828147361026222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 147.22222222222223, 141, 151, 149.0, 151.0, 151.0, 151.0, 0.057671605064848516, 0.0428594643108884, 0.03238395792215615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 797.3999999999997, 142, 1760, 433.5, 1619.5, 1753.0, 1760.0, 0.08760748343123469, 35.486202540014716, 0.04811567254074843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 164.1875, 142, 436, 147.0, 235.8000000000002, 436.0, 436.0, 0.13658286738657222, 0.03681335097528704, 0.08029578727218405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 633.75, 142, 1195, 442.0, 1169.2, 1193.9, 1195.0, 0.08760172750606642, 11.604003713765735, 0.048198059840740055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 200.875, 143, 430, 149.0, 428.6, 430.0, 430.0, 0.13658170146654602, 0.03681303672340498, 0.08042848240656958], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 531.75, 144, 1152, 514.5, 1010.6000000000001, 1152.0, 1152.0, 0.11497061063765575, 0.024055130204216547, 0.07721781002543725], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34a953fa-9f09-4b96-b069-f9636602bed8", 1, 0, 0.0, 950.0, 950, 950, 950.0, 950.0, 950.0, 950.0, 1.0526315789473684, 0.19017269736842107, 0.7257401315789475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a583f41-4863-48c6-9668-b1dd3e0f885b", 3, 0, 0.0, 640.6666666666666, 236, 1214, 472.0, 1214.0, 1214.0, 1214.0, 0.03609109392105675, 0.023203095863960636, 0.023144353849115167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7f5fe86-05e0-48c8-8aed-02dd7bfdb29d", 3, 0, 0.0, 788.3333333333334, 532, 1265, 568.0, 1265.0, 1265.0, 1265.0, 0.03163722646981282, 0.025900919456894277, 0.02028819535987345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 503.6363636363636, 288, 883, 567.0, 877.4, 883.0, 883.0, 0.08156304452600749, 0.12640678873317762, 0.18343719877284692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39a223a0-fe94-46a4-8988-6f2dfe8236fa", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53c48b54-4842-45ee-8331-e691087ba794", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 660.7083333333334, 289, 1320, 608.5, 1019.5, 1266.5, 1320.0, 0.10437233089507972, 0.06411151966113783, 0.04719178633244327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 162.35000000000002, 143, 446, 147.5, 154.8, 431.4499999999998, 446.0, 0.08771545107670717, 0.0651869709661857, 0.04402904477873778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 261.34999999999997, 142, 449, 149.5, 447.7, 448.95, 449.0, 0.08771660519194587, 0.08275684792572158, 0.04671080547965632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5641e19e-ecb0-4ddb-b2c5-776413cb85e7", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["login", 24, 0, 0.0, 3090.2083333333335, 1729, 4253, 3026.0, 4176.5, 4241.25, 4253.0, 0.10372726644077172, 46.67330668614074, 0.22100289409878293], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 169.0, 144, 436, 150.5, 246.30000000000018, 436.0, 436.0, 0.13306166576572828, 0.10772277433573121, 0.04729926400266123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64a53da6-a84a-4c73-b64f-737fe644d5f9", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 990.7500000000002, 286, 1911, 738.0, 1763.6, 1903.6499999999999, 1911.0, 0.08754612586506516, 47.20564478952817, 0.1868135152614784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f1b73b7-f2d9-4465-b5a3-ec8a07031429", 1, 0, 0.0, 1152.0, 1152, 1152, 1152.0, 1152.0, 1152.0, 1152.0, 0.8680555555555555, 0.15682644314236113, 0.598483615451389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 575.8125000000001, 290, 1625, 580.5, 1467.5000000000002, 1625.0, 1625.0, 0.07693824263436543, 11.609945124399522, 0.1705752395904962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 957.8235294117648, 141, 2055, 1405.0, 1876.6, 2055.0, 2055.0, 0.10783038914084551, 68.30908966572579, 0.1623464308934065], "isController": false}, {"data": ["register", 25, 9, 36.0, 1138.1200000000001, 292, 2239, 1134.0, 1980.2000000000007, 2224.9, 2239.0, 0.10105297196790558, 0.03148431657875058, 0.0455922588370824], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 154.33333333333331, 146, 176, 152.0, 168.8, 176.0, 176.0, 0.07283851700779373, 0.05654943459101173, 0.025891816592614175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 368.6875, 289, 587, 300.0, 583.5, 587.0, 587.0, 0.13641285350112115, 0.21141327979128835, 0.3067957047002754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efa42070-84ba-4879-bcde-34de0edc6b46", 3, 0, 0.0, 382.3333333333333, 259, 475, 413.0, 475.0, 475.0, 475.0, 0.08391843128479118, 0.03895432389717195, 0.05381487943718705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 545.4285714285714, 292, 1622, 571.0, 1175.0, 1622.0, 1622.0, 0.07211179388388972, 6.2659746536702325, 0.16086322324266134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 147.25, 140, 152, 150.0, 152.0, 152.0, 152.0, 0.043073742246726394, 0.03201085727515506, 0.021620999526188834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 144.87500000000003, 142, 149, 143.5, 149.0, 149.0, 149.0, 0.043074206088539034, 0.011525715301034857, 0.024565758159869916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 147.625, 140, 151, 148.5, 151.0, 151.0, 151.0, 0.04307281459306958, 0.011609469558288286, 0.025322103891628797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 146.125, 141, 150, 147.5, 150.0, 150.0, 150.0, 0.04307304650273783, 0.011609532065191056, 0.02536430375112394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 148.75, 144, 154, 148.5, 154.0, 154.0, 154.0, 0.042803638309256285, 0.012623729266987694, 0.026459670947030497], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1617.709090909091, 1126, 2565, 1580.0, 2186.2, 2324.7999999999997, 2565.0, 0.24331653711904372, 291.09116890923406, 0.4804551152877992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e05345f5-3a67-4c42-b0c6-4cc630da7731", 3, 0, 0.0, 479.6666666666667, 292, 682, 465.0, 682.0, 682.0, 682.0, 0.019574962318197536, 0.026985665826030784, 0.012552954351187874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1138.1200000000001, 292, 2239, 1134.0, 1980.2000000000007, 2224.9, 2239.0, 0.0970173001249583, 0.030226952570182316, 0.04377147720481517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79c6f3bd-f319-4f8d-9416-a5d0992ccd8f", 3, 0, 0.0, 866.3333333333334, 259, 1448, 892.0, 1448.0, 1448.0, 1448.0, 0.02564935620115935, 0.025724500799404935, 0.01644831761597784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 238.12500000000003, 143, 596, 148.5, 596.0, 596.0, 596.0, 0.03792170116751437, 0.010221083517806609, 0.022330845511729654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 218.50000000000003, 142, 441, 148.5, 441.0, 441.0, 441.0, 0.037972460473041925, 0.01023476473687458, 0.022323653520284415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 296.2, 142, 1816, 147.0, 992.8000000000005, 1816.0, 1816.0, 0.06956295911553016, 4.190357624622041, 0.04049687372467908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 270.79999999999995, 143, 1132, 148.0, 718.6000000000003, 1132.0, 1132.0, 0.06956360432221863, 1.3811002208644438, 0.04056518254649168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 168.86666666666667, 141, 445, 149.0, 273.4000000000001, 445.0, 445.0, 0.06956070098637074, 0.05169501313537903, 0.03491621123729938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 146.5, 142, 152, 148.0, 152.0, 152.0, 152.0, 0.037971739532852676, 0.010160406867189095, 0.021655757702330043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 165.06666666666663, 141, 443, 145.0, 269.60000000000014, 443.0, 443.0, 0.06956424954087596, 0.025579354258259596, 0.03928387373161185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 187.0, 144, 427, 150.0, 427.0, 427.0, 427.0, 0.03796957687652768, 0.028217625002966373, 0.01905894776810081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 221.0, 145, 445, 150.5, 445.0, 445.0, 445.0, 0.038070401690325835, 0.02996557008047131, 0.013532838100858011], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 512.3125, 142, 1455, 488.0, 1060.9000000000003, 1455.0, 1455.0, 0.11794365242005632, 0.023870919886774096, 0.08025121076530688], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1466.2500000000002, 969, 1910, 1442.5, 1846.5, 1904.5, 1910.0, 0.10365155801248137, 0.05364777904942884, 0.047675667796756575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 461.50000000000006, 288, 1024, 315.5, 1024.0, 1024.0, 1024.0, 0.037892782372277646, 0.05872641174297325, 0.08522175566733926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44e4a83d-37f4-44e4-a7ff-487cae11d709", 3, 0, 0.0, 719.0, 489, 1175, 493.0, 1175.0, 1175.0, 1175.0, 0.028022717082648335, 0.023361386213757288, 0.017970297087505607], "isController": false}, {"data": ["addBook", 53, 13, 24.528301886792452, 1371.509433962264, 721, 2774, 1148.0, 2401.2, 2547.9, 2774.0, 0.24109539189373605, 71.75990307140745, 0.8755966968794068], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7b7957f-0d0d-4939-bcbf-adbf15f10eb9", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39a223a0-fe94-46a4-8988-6f2dfe8236fa", 3, 0, 0.0, 328.3333333333333, 244, 454, 287.0, 454.0, 454.0, 454.0, 0.039877708361026186, 0.033244404659045594, 0.025572618968496608], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 250.43636363636364, 141, 624, 150.0, 583.8, 600.0, 624.0, 0.24499322927802722, 0.18207016355525266, 0.11842934423107761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7f5fe86-05e0-48c8-8aed-02dd7bfdb29d", 1, 0, 0.0, 892.0, 892, 892, 892.0, 892.0, 892.0, 892.0, 1.1210762331838564, 0.20253818665919282, 0.7729295123318386], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 954.3636363636361, 703, 1411, 884.0, 1211.8, 1319.0, 1411.0, 0.24485253199777407, 71.99477427657206, 0.12314360740122426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34a953fa-9f09-4b96-b069-f9636602bed8", 3, 0, 0.0, 362.3333333333333, 232, 500, 355.0, 500.0, 500.0, 500.0, 0.026006224156314744, 0.0260824142661477, 0.01667716848565757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57ee09e5-7dd5-455b-b729-f03f745b7b18", 3, 0, 0.0, 415.3333333333333, 238, 521, 487.0, 521.0, 521.0, 521.0, 0.04160079873533572, 0.02701614370995923, 0.02667759554316776], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 211.65454545454546, 142, 598, 148.0, 444.6, 490.59999999999945, 598.0, 0.24549297220573202, 0.43440748597342427, 0.11939013687349079], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1363.3454545454545, 977, 1961, 1334.0, 1705.3999999999999, 1787.3999999999994, 1961.0, 0.2439705993248668, 219.52517412708428, 0.12246180473923979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 183.42857142857142, 143, 461, 158.0, 328.0, 461.0, 461.0, 0.07026207754925873, 0.05249071223162396, 0.024975972878838067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 13, 8.074534161490684, 211.16770186335395, 142, 737, 155.0, 361.4000000000001, 464.5000000000001, 714.0599999999998, 0.6592092764256936, 1.5325704018105735, 0.31263099097374625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 158.375, 150, 182, 155.0, 182.0, 182.0, 182.0, 0.042540746058333995, 0.03294415197681529, 0.015121905825423413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 169.3125, 144, 448, 151.0, 249.9000000000002, 448.0, 448.0, 0.07704531227428131, 0.06252407666008572, 0.027387200847498436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 297.375, 289, 302, 299.5, 302.0, 302.0, 302.0, 0.043039214103950466, 0.06670237576461853, 0.09679620125136515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5641e19e-ecb0-4ddb-b2c5-776413cb85e7", 3, 0, 0.0, 479.3333333333333, 390, 616, 432.0, 616.0, 616.0, 616.0, 0.021318173743116006, 0.025197359655356192, 0.0136708340735477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 506.73333333333335, 291, 1957, 301.0, 1316.8000000000004, 1957.0, 1957.0, 0.06951363625831268, 5.644715443033575, 0.1551520828023264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 151.1818181818182, 145, 167, 150.0, 164.60000000000002, 167.0, 167.0, 0.08736260245250652, 0.07243247019743948, 0.031054675090539424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 153.79999999999998, 143, 200, 153.0, 161.4, 198.09999999999997, 200.0, 0.0906322505800464, 0.07036390547962587, 0.03221693282337587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f1b73b7-f2d9-4465-b5a3-ec8a07031429", 3, 0, 0.0, 750.0, 297, 1455, 498.0, 1455.0, 1455.0, 1455.0, 0.028749952083413195, 0.023967652111204815, 0.01843665547015755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 149.14285714285714, 143, 157, 149.5, 157.0, 157.0, 157.0, 0.0722703737926976, 0.053708744586174674, 0.036276339970162656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 250.78571428571428, 140, 442, 149.0, 442.0, 442.0, 442.0, 0.07226962765655409, 0.02709102811288516, 0.04078273491500576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 282.1428571428571, 141, 1472, 148.0, 949.0, 1472.0, 1472.0, 0.07216643642136951, 4.6563107696163835, 0.041982985473927294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 372.7142857142857, 141, 1178, 421.0, 874.5, 1178.0, 1178.0, 0.07216643642136951, 1.5337280633363575, 0.04205346050949504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efa42070-84ba-4879-bcde-34de0edc6b46", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.68421052631579, 0.702576112412178], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.526315789473685, 0.312256049960968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.526315789473685, 0.312256049960968], "isController": false}, {"data": ["401/Unauthorized", 21, 55.26315789473684, 1.639344262295082], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 38, "401/Unauthorized", 21, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
