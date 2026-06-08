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

    var data = {"OkPercent": 96.96739954510993, "KoPercent": 3.0326004548900682};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7837314396384765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.32456140350877194, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56bf5ebf-319d-4c83-98f9-b1daa203d7fc"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9ee93b2-9c91-4c98-bbb1-e4c96a7eb35e"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a6ac206-3914-498c-b00e-1c5762f164f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c55f4b5-695a-4bfb-9838-7f4a60640bf4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45cca39f-71be-43e6-b0d8-3a621d8ed8cc"], "isController": false}, {"data": [0.7291666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f048155-4a03-45f4-8bfa-7def949ad4cc"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c487dbc-3421-4fb2-9be5-510cbe460e50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c291ce7b-b683-4f66-8e61-72d5065a7135"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/88b58c88-9598-43c5-b7ef-9a1fcaec834c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56bf5ebf-319d-4c83-98f9-b1daa203d7fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc042e5d-ba9b-4192-aa88-182d021e046b"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7181c304-8164-4282-ab19-ab8a98171cb6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d38db6f-719c-4b52-a43e-aa73ee118c72"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/900a33e0-38e6-44c2-acc4-436def491b15"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71f9cc68-e94a-430d-af96-2342e5928942"], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c55f4b5-695a-4bfb-9838-7f4a60640bf4"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=900a33e0-38e6-44c2-acc4-436def491b15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7181c304-8164-4282-ab19-ab8a98171cb6"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13755f05-82ac-4ab9-ae40-73d644359201"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45cca39f-71be-43e6-b0d8-3a621d8ed8cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8245614035087719, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4c487dbc-3421-4fb2-9be5-510cbe460e50"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a6ac206-3914-498c-b00e-1c5762f164f7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c291ce7b-b683-4f66-8e61-72d5065a7135"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc042e5d-ba9b-4192-aa88-182d021e046b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d38db6f-719c-4b52-a43e-aa73ee118c72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71f9cc68-e94a-430d-af96-2342e5928942"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88b58c88-9598-43c5-b7ef-9a1fcaec834c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1319, 40, 3.0326004548900682, 317.2949203942381, 81, 2355, 96.0, 895.0, 1071.0, 1571.9999999999968, 5.162749917803072, 743.1869166403277, 3.7744306517237867], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1392.4736842105262, 996, 1835, 1405.0, 1656.2, 1753.3999999999996, 1835.0, 0.2586195162453891, 311.2075227369658, 1.2716301409136075], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/56bf5ebf-319d-4c83-98f9-b1daa203d7fc", 3, 0, 0.0, 369.6666666666667, 191, 483, 435.0, 483.0, 483.0, 483.0, 0.019689302801787788, 0.023272089346774567, 0.012626278163906884], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 508.0588235294118, 87, 1052, 457.0, 939.1999999999999, 1052.0, 1052.0, 0.09105273024289655, 0.019509804906135346, 0.06060592746578827], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 508.0588235294118, 87, 1052, 457.0, 939.1999999999999, 1052.0, 1052.0, 0.09188791836028712, 0.01968876008064516, 0.06116183996097466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 108.5909090909091, 82, 259, 85.0, 248.4, 257.5, 259.0, 0.10419873540625667, 0.02788130224737727, 0.05942584128638075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 95.09090909090908, 83, 251, 87.0, 98.4, 228.19999999999968, 251.0, 0.10419824189148226, 0.07743638874943165, 0.052302633136935436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 92.77272727272727, 83, 245, 85.0, 91.7, 222.04999999999967, 245.0, 0.10420021597862948, 0.028085214462989977, 0.061360088120228105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 100.0909090909091, 83, 259, 85.0, 197.19999999999987, 256.74999999999994, 259.0, 0.10420169659307817, 0.0280856135348531, 0.0612592005361651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9ee93b2-9c91-4c98-bbb1-e4c96a7eb35e", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 221.2941176470588, 82, 582, 181.0, 509.19999999999993, 582.0, 582.0, 0.09218039160399304, 0.14739966571052104, 0.05956670640816393], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 86.31818181818183, 83, 96, 85.0, 93.0, 95.55, 96.0, 0.1160539545385009, 0.08624712832402263, 0.05825364514920846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a6ac206-3914-498c-b00e-1c5762f164f7", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 107.77272727272728, 81, 263, 84.0, 252.8, 261.65, 263.0, 0.11605824013504959, 0.03897801157944714, 0.065746416042414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 620.8888888888889, 488, 675, 655.0, 675.0, 675.0, 675.0, 0.08261049153242463, 24.290227437009502, 0.04711379595208592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 817.7777777777778, 655, 1059, 740.0, 1059.0, 1059.0, 1059.0, 0.082563505096003, 74.29078701654481, 0.0470063705771189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 178.0, 82, 268, 243.0, 268.0, 268.0, 268.0, 0.08293860700001843, 0.14676245691800138, 0.04592401383692427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 85.66666666666667, 83, 90, 85.0, 90.0, 90.0, 90.0, 0.054518030324139974, 0.04051584089518606, 0.027365495690046825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 102.77777777777777, 83, 254, 84.0, 254.0, 254.0, 254.0, 0.05451902108068815, 0.014588097437606008, 0.031092879210079957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 84.0, 82, 88, 84.0, 88.0, 88.0, 88.0, 0.054519351340873164, 0.014694668916094718, 0.032051415534380505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 139.55555555555554, 82, 259, 84.0, 259.0, 259.0, 259.0, 0.05446161666283419, 0.014679107616154527, 0.0320706590309463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 84.88888888888889, 83, 89, 84.0, 89.0, 89.0, 89.0, 0.0830595444645428, 0.06172686849366902, 0.046639880924914175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 528.3, 83, 1141, 491.0, 1113.7, 1139.9, 1141.0, 0.09323053113433587, 41.957062169031616, 0.05080335583296818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 143.63636363636363, 81, 1034, 84.5, 249.9, 916.6999999999983, 1034.0, 0.11605701564659585, 4.776600342170371, 0.06777548374674248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 399.95, 83, 827, 395.0, 741.9, 822.8, 827.0, 0.09330621232761677, 13.730136711095973, 0.05093571551868923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 133.27272727272725, 82, 487, 85.0, 258.0, 453.0999999999995, 487.0, 0.11605824013504959, 1.5809947213283393, 0.06788953695399873], "isController": false}, {"data": ["deleteBooks", 17, 5, 29.41176470588235, 337.0, 84, 729, 409.0, 648.9999999999999, 729.0, 729.0, 0.09175351766794941, 0.0196599621381808, 0.061335919410726525], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 245.33333333333331, 168, 343, 173.0, 343.0, 343.0, 343.0, 0.054432630547592266, 0.08435994597561418, 0.12242026186631345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c55f4b5-695a-4bfb-9838-7f4a60640bf4", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45cca39f-71be-43e6-b0d8-3a621d8ed8cc", 3, 0, 0.0, 396.66666666666663, 164, 715, 311.0, 715.0, 715.0, 715.0, 0.06636140420731303, 0.030026807242241247, 0.042555978609507376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 543.8333333333334, 149, 1848, 493.0, 1098.5, 1710.0, 1848.0, 0.10311493018259935, 0.0633391514500537, 0.04662325456498389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 86.8, 83, 98, 85.0, 94.60000000000001, 97.85, 98.0, 0.09330447115025751, 0.06934052982943943, 0.046834470870344105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 137.54999999999998, 81, 266, 89.0, 263.6, 265.9, 266.0, 0.09323357340978486, 0.09496349322891173, 0.04925719063934923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f048155-4a03-45f4-8bfa-7def949ad4cc", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["login", 24, 0, 0.0, 2543.3749999999995, 1474, 3511, 2569.5, 3230.0, 3449.0, 3511.0, 0.1068485466371646, 48.077763516619406, 0.22765314123597058], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 105.49999999999999, 86, 257, 90.0, 210.6999999999999, 256.4, 257.0, 0.1079712207618842, 0.08741029493320507, 0.03838039488020102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c487dbc-3421-4fb2-9be5-510cbe460e50", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c291ce7b-b683-4f66-8e61-72d5065a7135", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88b58c88-9598-43c5-b7ef-9a1fcaec834c", 3, 0, 0.0, 733.6666666666666, 562, 1057, 582.0, 1057.0, 1057.0, 1057.0, 0.026155415478774882, 0.026232042672560355, 0.016772841306375817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56bf5ebf-319d-4c83-98f9-b1daa203d7fc", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc042e5d-ba9b-4192-aa88-182d021e046b", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 633.95, 168, 1227, 581.5, 1200.9, 1225.95, 1227.0, 0.09319273655811267, 55.81767125039024, 0.19767053105880927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7181c304-8164-4282-ab19-ab8a98171cb6", 3, 0, 0.0, 569.0, 287, 1004, 416.0, 1004.0, 1004.0, 1004.0, 0.02205476934387061, 0.0260679907186179, 0.014143195184708692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d38db6f-719c-4b52-a43e-aa73ee118c72", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/900a33e0-38e6-44c2-acc4-436def491b15", 3, 0, 0.0, 462.3333333333333, 387, 509, 491.0, 509.0, 509.0, 509.0, 0.06374163391054924, 0.028841429406140446, 0.04087598268352279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 219.90909090909093, 169, 511, 177.5, 336.9, 485.19999999999965, 511.0, 0.10415384469714903, 0.16141811673278858, 0.23424443782962326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, 52.63157894736842, 472.8421052631579, 82, 1144, 92.0, 1010.0, 1144.0, 1144.0, 0.17319805653549192, 98.17417058641216, 0.24539358688617244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71f9cc68-e94a-430d-af96-2342e5928942", 3, 0, 0.0, 454.3333333333333, 180, 702, 481.0, 702.0, 702.0, 702.0, 0.027609055770292656, 0.023016533798085773, 0.017705025998527517], "isController": false}, {"data": ["register", 27, 9, 33.333333333333336, 1041.1851851851854, 119, 2355, 1018.0, 2018.3999999999996, 2331.4, 2355.0, 0.10854707726943796, 0.03392096164669936, 0.048973388377422204], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8c55f4b5-695a-4bfb-9838-7f4a60640bf4", 3, 0, 0.0, 318.6666666666667, 220, 465, 271.0, 465.0, 465.0, 465.0, 0.029414071691897404, 0.02950024573005726, 0.01886253946387952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 260.72727272727275, 167, 1119, 175.0, 342.9, 1002.8999999999984, 1119.0, 0.11600255205614524, 6.479763115868094, 0.25954335199919853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 105.9090909090909, 85, 251, 90.0, 222.4000000000001, 251.0, 251.0, 0.08595831803014793, 0.06673521761129649, 0.030555495862279146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=900a33e0-38e6-44c2-acc4-436def491b15", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 244.5, 168, 341, 180.0, 340.3, 341.0, 341.0, 0.10528185927763484, 0.16316631901719383, 0.23678136905897756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 116.2, 83, 246, 84.0, 246.0, 246.0, 246.0, 0.026805914456965785, 0.019921192286866174, 0.013455312530156653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 84.4, 82, 90, 83.0, 90.0, 90.0, 90.0, 0.02680605816914623, 0.00717271478354108, 0.015287830049591207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 118.0, 83, 256, 84.0, 256.0, 256.0, 256.0, 0.0267810754208646, 0.007218336734529911, 0.015744343167344226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 116.4, 81, 251, 83.0, 251.0, 251.0, 251.0, 0.026781792666073896, 0.00721853005452773, 0.015770918923479062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 93.4, 84, 111, 90.0, 111.0, 111.0, 111.0, 0.15405946695424436, 0.045435506855646283, 0.09523402595902018], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 976.5789473684212, 651, 1486, 943.0, 1302.8, 1398.9999999999998, 1486.0, 0.2575212003198684, 308.0848844373613, 0.5085037764128651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 9, 33.333333333333336, 1041.1851851851854, 119, 2355, 1018.0, 2018.3999999999996, 2331.4, 2355.0, 0.10663338651838043, 0.033322933286993886, 0.04810998493309742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 112.83333333333333, 82, 252, 86.0, 252.0, 252.0, 252.0, 0.03189351817398978, 0.008596299820333182, 0.018781046346597493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 112.5, 85, 245, 86.0, 245.0, 245.0, 245.0, 0.03189351817398978, 0.008596299820333182, 0.018749900332755705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 217.45454545454547, 83, 894, 85.0, 862.2000000000002, 894.0, 894.0, 0.0864311026251483, 14.159216281066088, 0.04946154896321964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 217.54545454545456, 82, 649, 88.0, 648.8, 649.0, 649.0, 0.08631919268013247, 4.6337099008114, 0.04948180283519312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 142.33333333333331, 82, 256, 88.5, 256.0, 256.0, 256.0, 0.0318925010099292, 0.008533735621797461, 0.018188691982225245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 100.27272727272727, 84, 249, 85.0, 216.80000000000013, 249.0, 249.0, 0.08642770715149992, 0.06422996595926898, 0.04338265769128023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 143.33333333333331, 85, 258, 90.0, 258.0, 258.0, 258.0, 0.03189199245222846, 0.023700982672017437, 0.016008285273872484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 99.18181818181817, 83, 258, 83.0, 223.40000000000012, 258.0, 258.0, 0.08643178175189364, 0.04673025132004903, 0.04797332204481881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 94.0, 88, 108, 90.0, 108.0, 108.0, 108.0, 0.03287040841482455, 0.025872606623387296, 0.011684402991207167], "isController": false}, {"data": ["deleteAccount", 17, 5, 29.41176470588235, 415.88235294117646, 83, 1006, 428.0, 773.1999999999998, 1006.0, 1006.0, 0.09377913359113402, 0.019339791451756155, 0.06380515040518103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7181c304-8164-4282-ab19-ab8a98171cb6", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1368.875, 961, 2062, 1284.5, 1942.5, 2042.75, 2062.0, 0.10466044227758566, 0.05416995547570352, 0.04813971514916294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 288.6666666666667, 172, 515, 180.5, 515.0, 515.0, 515.0, 0.031876404554075664, 0.04940220119855281, 0.0716907809453479], "isController": false}, {"data": ["addBook", 54, 11, 20.37037037037037, 924.8518518518522, 428, 3234, 745.5, 1559.5, 1884.25, 3234.0, 0.23955814830423885, 69.97349853326088, 0.870963001574873], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/13755f05-82ac-4ab9-ae40-73d644359201", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.8772965315934066, 1.6392299107142858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45cca39f-71be-43e6-b0d8-3a621d8ed8cc", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 161.22807017543857, 83, 450, 88.0, 344.20000000000005, 378.2999999999997, 450.0, 0.25822585248508406, 0.1919041735753408, 0.12482597361339513], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 522.9122807017546, 406, 849, 489.0, 670.8000000000001, 741.3999999999999, 849.0, 0.25811944137518794, 75.89568613638217, 0.12981592998849784], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 153.1929824561403, 82, 416, 89.0, 266.0, 340.4, 416.0, 0.2585890113280133, 0.45758133645152366, 0.1257591090247565], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 811.4736842105265, 565, 1151, 809.0, 1056.8, 1076.4999999999998, 1151.0, 0.2579839235281338, 232.1343878779804, 0.12949583661470782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 90.1875, 86, 98, 89.5, 96.6, 98.0, 98.0, 0.10261935914210216, 0.07666387670283999, 0.036477975320044126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 11, 6.666666666666667, 160.16363636363653, 84, 1845, 91.0, 297.0000000000001, 393.1999999999998, 1287.9600000000028, 0.6975004121593344, 1.6045357936603553, 0.33087510673869946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 94.0, 86, 100, 96.0, 100.0, 100.0, 100.0, 0.028705606779116096, 0.02223002556234284, 0.010203946159763926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 99.63636363636365, 84, 264, 91.0, 101.89999999999999, 239.99999999999966, 264.0, 0.10463285757090066, 0.0849120162513852, 0.03719371108965609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c487dbc-3421-4fb2-9be5-510cbe460e50", 3, 0, 0.0, 489.6666666666667, 167, 760, 542.0, 760.0, 760.0, 760.0, 0.0490444506204123, 0.031530856111755955, 0.031451031159574296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 236.6, 168, 503, 170.0, 503.0, 503.0, 503.0, 0.02676903144290433, 0.04148677041004803, 0.060204179114266294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 349.27272727272737, 168, 985, 177.0, 983.8, 985.0, 985.0, 0.08625894936599672, 18.872231320526495, 0.18998564229589956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a6ac206-3914-498c-b00e-1c5762f164f7", 3, 0, 0.0, 275.0, 179, 428, 218.0, 428.0, 428.0, 428.0, 0.04098080732190425, 0.026826954272249164, 0.026280009903695105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c291ce7b-b683-4f66-8e61-72d5065a7135", 3, 0, 0.0, 733.0, 203, 1006, 990.0, 1006.0, 1006.0, 1006.0, 0.02113211800174692, 0.029132330643684316, 0.013551520984193176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 89.22222222222223, 83, 93, 90.0, 93.0, 93.0, 93.0, 0.05599313150920154, 0.04642399282354698, 0.019903808466161483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 106.64999999999999, 84, 262, 91.0, 236.50000000000034, 261.5, 262.0, 0.09122173266559025, 0.07082156002846118, 0.032426475283471534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc042e5d-ba9b-4192-aa88-182d021e046b", 3, 0, 0.0, 282.6666666666667, 181, 402, 265.0, 402.0, 402.0, 402.0, 0.02849923052077594, 0.028582724360192272, 0.01827587373890905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d38db6f-719c-4b52-a43e-aa73ee118c72", 3, 0, 0.0, 316.0, 173, 591, 184.0, 591.0, 591.0, 591.0, 0.0373134328358209, 0.030888040267412934, 0.023928210509950247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71f9cc68-e94a-430d-af96-2342e5928942", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88b58c88-9598-43c5-b7ef-9a1fcaec834c", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 85.25, 82, 93, 84.5, 92.3, 93.0, 93.0, 0.10534216451812543, 0.07828651093583346, 0.052876828674137184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 128.49999999999997, 81, 256, 86.0, 253.9, 256.0, 256.0, 0.10534077741493732, 0.028186887706731275, 0.06007716211945644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 117.68750000000001, 83, 257, 85.0, 252.1, 257.0, 257.0, 0.10534077741493732, 0.028392631412619825, 0.06192885547245339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 136.4375, 82, 252, 87.0, 251.3, 252.0, 252.0, 0.10534008387704179, 0.028392444482483917, 0.06203131892368769], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 22.5, 0.6823351023502654], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 12.5, 0.37907505686125853], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 12.5, 0.37907505686125853], "isController": false}, {"data": ["401/Unauthorized", 21, 52.5, 1.592115238817286], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1319, 40, "401/Unauthorized", 21, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
