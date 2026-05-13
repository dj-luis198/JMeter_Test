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

    var data = {"OkPercent": 98.61325115562404, "KoPercent": 1.386748844375963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7682360742705571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/686cb76b-76e3-4d94-a9bc-1f283d646a16"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "see books"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/061c863a-8375-4962-bd9b-754cf3db588a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c3c8a43-4bd0-43a8-a9c6-728acffed939"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bff8803-ded6-4567-aa49-33c424f92482"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b66f5ef7-78f1-4f69-9049-5798914ca8df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7daa3b49-4717-4b9c-9444-6997807df4d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c3d69dd-704f-47fd-b053-2db3ec01c5ca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f4578e49-afdb-4d1e-a81b-34b7882213d9"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8f4db31-a263-4656-869b-36c5c0a31a63"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8b1c166a-ea50-426d-b244-a31e4a9a9155"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3cb8fe17-6368-4fd8-86f1-579ca5f9ad09"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2ba43429-2f27-4913-aeb7-d9f259303a48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbf893fd-1fc3-42c8-bc47-9ddbf292959e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e3d2af4-7c84-4e63-81df-998232e84b62"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cee15dd-b515-426b-b259-ead8060432fd"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e3d2af4-7c84-4e63-81df-998232e84b62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=061c863a-8375-4962-bd9b-754cf3db588a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38596491228070173, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bff8803-ded6-4567-aa49-33c424f92482"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ba43429-2f27-4913-aeb7-d9f259303a48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9a4abce-ecdc-411d-9ae7-25c96b2e1d0e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b66f5ef7-78f1-4f69-9049-5798914ca8df"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8f4db31-a263-4656-869b-36c5c0a31a63"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4578e49-afdb-4d1e-a81b-34b7882213d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b1c166a-ea50-426d-b244-a31e4a9a9155"], "isController": false}, {"data": [0.9619883040935673, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7daa3b49-4717-4b9c-9444-6997807df4d2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cb8fe17-6368-4fd8-86f1-579ca5f9ad09"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2cee15dd-b515-426b-b259-ead8060432fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 18, 1.386748844375963, 413.77580893682585, 112, 3295, 130.5, 1144.1000000000001, 1364.05, 2113.4799999999996, 5.268990489025643, 761.0253881275701, 3.8503828885170104], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/686cb76b-76e3-4d94-a9bc-1f283d646a16", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.5109375, 0.9546875], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1867.8245614035086, 1381, 2344, 1847.0, 2289.4, 2335.4, 2344.0, 0.25634683276742143, 308.4717516049785, 1.2604553740077804], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 488.6153846153848, 116, 815, 520.0, 759.0, 815.0, 815.0, 0.11445576284765938, 0.022689960798901225, 0.07695155329676619], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 488.6153846153848, 116, 815, 520.0, 759.0, 815.0, 815.0, 0.11532695190866106, 0.022862667224080268, 0.07753727611046547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/061c863a-8375-4962-bd9b-754cf3db588a", 3, 0, 0.0, 676.0, 206, 1421, 401.0, 1421.0, 1421.0, 1421.0, 0.04231669816909753, 0.026819860460687784, 0.02713668469828194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 206.13333333333335, 113, 350, 116.0, 345.8, 350.0, 350.0, 0.07958826338409296, 0.02926526768185918, 0.04494457009073062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 133.73333333333335, 115, 347, 116.0, 218.60000000000008, 347.0, 347.0, 0.0795823518176609, 0.05914274388011714, 0.03994661018972433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 212.86666666666665, 113, 906, 115.0, 567.6000000000001, 906.0, 906.0, 0.07958995256438828, 1.5801610933802384, 0.04641192741661626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 237.73333333333335, 114, 1258, 116.0, 713.8000000000003, 1258.0, 1258.0, 0.0795895302625924, 4.79434169012347, 0.04633395700573575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c3c8a43-4bd0-43a8-a9c6-728acffed939", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.7676344651442308, 1.434326171875], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 235.6923076923077, 115, 421, 215.0, 397.0, 421.0, 421.0, 0.11423750856781315, 0.24312371208193465, 0.07383560124079509], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bff8803-ded6-4567-aa49-33c424f92482", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 128.77777777777777, 113, 345, 116.0, 146.1000000000003, 345.0, 345.0, 0.10811914730032496, 0.0803502647417454, 0.05427074385973343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 128.99999999999997, 113, 340, 115.0, 168.10000000000028, 340.0, 340.0, 0.10811849787366955, 0.028930144938852983, 0.06166133081857716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b66f5ef7-78f1-4f69-9049-5798914ca8df", 1, 0, 0.0, 812.0, 812, 812, 812.0, 812.0, 812.0, 812.0, 1.2315270935960592, 0.22249268780788176, 0.8490802032019704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 862.4, 678, 914, 907.0, 914.0, 914.0, 914.0, 0.09712698381864449, 28.558558162066085, 0.05539273295907069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1193.6, 909, 1460, 1232.0, 1460.0, 1460.0, 1460.0, 0.0967305088024763, 87.03828185456568, 0.05507215491390985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 207.4, 113, 353, 116.0, 353.0, 353.0, 353.0, 0.09819902979358563, 0.17376625193943082, 0.054373876848596736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 115.53333333333333, 114, 118, 116.0, 117.4, 118.0, 118.0, 0.0770574334737491, 0.05726631530617487, 0.038679219536627965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 159.66666666666666, 113, 343, 114.0, 343.0, 343.0, 343.0, 0.07705822519495731, 0.03605080769863042, 0.043084377472284725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 310.1333333333334, 112, 1242, 116.0, 1239.6, 1242.0, 1242.0, 0.0770578293323196, 9.262902932178836, 0.044418621152887874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 204.13333333333333, 114, 673, 115.0, 670.6, 673.0, 673.0, 0.0770578293323196, 3.0390082785794648, 0.044493872939345216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7daa3b49-4717-4b9c-9444-6997807df4d2", 3, 0, 0.0, 372.6666666666667, 204, 606, 308.0, 606.0, 606.0, 606.0, 0.04616734122281898, 0.029681151990581866, 0.029606009833643684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 164.6, 116, 341, 122.0, 341.0, 341.0, 341.0, 0.09864073073053325, 0.07330624617767169, 0.055389082197320916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c3d69dd-704f-47fd-b053-2db3ec01c5ca", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.040182206840391, 1.9435820439739413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4578e49-afdb-4d1e-a81b-34b7882213d9", 3, 0, 0.0, 1337.6666666666667, 361, 2904, 748.0, 2904.0, 2904.0, 2904.0, 0.018769708193603286, 0.022185159652009612, 0.012036564173632315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 964.6428571428572, 114, 1363, 1246.0, 1361.5, 1363.0, 1363.0, 0.07031889619424089, 45.20046261357758, 0.03702336973173341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 139.50000000000003, 113, 340, 114.5, 340.0, 340.0, 340.0, 0.10811979673478214, 0.029141663963671748, 0.06356261487728403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 656.9285714285713, 113, 1025, 682.5, 1023.0, 1025.0, 1025.0, 0.07039916325565959, 14.790915270835637, 0.03713438005993985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 140.8888888888889, 113, 340, 115.0, 339.1, 340.0, 340.0, 0.10811849787366955, 0.029141313880012492, 0.06366743575959251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8f4db31-a263-4656-869b-36c5c0a31a63", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 545.6153846153845, 117, 1247, 479.0, 1072.9999999999998, 1247.0, 1247.0, 0.11585316947536338, 0.022966985745604265, 0.07860470452985893], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8b1c166a-ea50-426d-b244-a31e4a9a9155", 3, 0, 0.0, 784.0, 421, 1005, 926.0, 1005.0, 1005.0, 1005.0, 0.017409773847037728, 0.02400077872467603, 0.011164470858940208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 426.99999999999994, 229, 1358, 233.0, 1354.4, 1358.0, 1358.0, 0.07701154146301392, 12.387782752687702, 0.1705735450594529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cb8fe17-6368-4fd8-86f1-579ca5f9ad09", 3, 0, 0.0, 502.33333333333337, 203, 776, 528.0, 776.0, 776.0, 776.0, 0.021244954323348206, 0.025110816779973087, 0.013623880213865873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 578.7142857142857, 125, 1314, 509.0, 1158.6000000000001, 1299.6999999999998, 1314.0, 0.09598639735626037, 0.05896039446981228, 0.04340009958588725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 116.99999999999999, 113, 131, 117.0, 124.5, 131.0, 131.0, 0.07039739328509437, 0.05231681278316094, 0.03533619155130713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 205.0714285714286, 114, 462, 115.5, 403.5, 462.0, 462.0, 0.07039880925442633, 0.09436268963679244, 0.03592617804864558], "isController": false}, {"data": ["login", 21, 0, 0.0, 3298.904761904762, 1940, 6288, 3074.0, 4678.400000000001, 6140.499999999998, 6288.0, 0.09493928406737977, 27.173504755723485, 0.18072635757525068], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2ba43429-2f27-4913-aeb7-d9f259303a48", 3, 0, 0.0, 1332.3333333333333, 215, 3023, 759.0, 3023.0, 3023.0, 3023.0, 0.027024348938393495, 0.02710352183567394, 0.017330067515831764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbf893fd-1fc3-42c8-bc47-9ddbf292959e", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 149.44444444444443, 116, 344, 121.5, 342.2, 344.0, 344.0, 0.10939123776185528, 0.08855989853962698, 0.038885166548159496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e3d2af4-7c84-4e63-81df-998232e84b62", 3, 0, 0.0, 456.33333333333337, 271, 785, 313.0, 785.0, 785.0, 785.0, 0.02894579417610621, 0.02413091760579688, 0.018562244312151446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1082.4285714285713, 231, 1477, 1363.0, 1476.5, 1477.0, 1477.0, 0.07027689095034437, 60.0851142564203, 0.1452108024366002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cee15dd-b515-426b-b259-ead8060432fd", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 448.3333333333333, 230, 1381, 456.0, 965.8000000000002, 1381.0, 1381.0, 0.07953171724883884, 6.458213621529765, 0.17751210041939725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 806.1111111111111, 115, 1577, 1029.0, 1577.0, 1577.0, 1577.0, 0.17369487600115796, 115.4647996477854, 0.2687408026150729], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1357.1304347826087, 119, 3295, 1236.0, 2510.2000000000003, 3156.199999999998, 3295.0, 0.09381436991413947, 0.029555987804131913, 0.04232640517610589], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 146.33333333333331, 116, 346, 119.0, 345.1, 346.0, 346.0, 0.07876427602502954, 0.06114999945302586, 0.027998238743272216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 296.83333333333326, 229, 686, 233.0, 481.70000000000033, 686.0, 686.0, 0.10804386580951866, 0.16744688968721302, 0.2429931864837124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 425.52941176470586, 230, 1471, 458.0, 668.5999999999992, 1471.0, 1471.0, 0.11187522621828831, 8.036224745812904, 0.2499262219900628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e3d2af4-7c84-4e63-81df-998232e84b62", 1, 0, 0.0, 1247.0, 1247, 1247, 1247.0, 1247.0, 1247.0, 1247.0, 0.8019246190858059, 0.14487895950280671, 0.5528894346431436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 118.00000000000001, 114, 124, 117.0, 124.0, 124.0, 124.0, 0.033309699308585815, 0.024754571458822074, 0.016719907660754988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 148.0, 115, 341, 116.0, 341.0, 341.0, 341.0, 0.033310016321908, 0.00891303171113554, 0.018997118683588155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=061c863a-8375-4962-bd9b-754cf3db588a", 1, 0, 0.0, 799.0, 799, 799, 799.0, 799.0, 799.0, 799.0, 1.2515644555694618, 0.22611271902377972, 0.862895025031289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 165.14285714285714, 114, 461, 115.0, 461.0, 461.0, 461.0, 0.033310016321908, 0.008978090336764265, 0.019582646314246693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 115.42857142857143, 113, 118, 115.0, 118.0, 118.0, 118.0, 0.033310016321908, 0.008978090336764265, 0.019615175627061058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 118.5, 117, 120, 118.5, 120.0, 120.0, 120.0, 5.524861878453039, 1.6294026243093924, 3.415271063535912], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1280.2105263157894, 902, 1869, 1250.0, 1727.0000000000002, 1825.9999999999998, 1869.0, 0.2608158502825505, 312.02643119838024, 0.5150094231165206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bff8803-ded6-4567-aa49-33c424f92482", 3, 0, 0.0, 308.6666666666667, 211, 415, 300.0, 415.0, 415.0, 415.0, 0.03627306362295359, 0.03023936065702609, 0.02326104665925084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1357.1304347826087, 119, 3295, 1236.0, 2510.2000000000003, 3156.199999999998, 3295.0, 0.09633911368015415, 0.030351402152969758, 0.043465498554913294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 138.1, 113, 345, 115.5, 322.20000000000005, 345.0, 345.0, 0.05005280571002408, 0.013490795289029927, 0.02947445492494582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 115.29999999999998, 114, 117, 115.5, 117.0, 117.0, 117.0, 0.05011074474588841, 0.013506411669790237, 0.029459637047875808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 279.99999999999994, 113, 1285, 115.0, 1241.8000000000002, 1285.0, 1285.0, 0.08084183295382584, 8.101770955438186, 0.04675422847698478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 203.72222222222223, 113, 685, 116.0, 675.1, 685.0, 685.0, 0.08084255911612136, 2.660523708203274, 0.04683359625878601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 145.77777777777774, 114, 415, 116.0, 354.7000000000001, 415.0, 415.0, 0.08083892843509308, 0.060076586463970544, 0.04057735274964633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 138.8, 114, 345, 115.0, 322.5000000000001, 345.0, 345.0, 0.05005280571002408, 0.013393035902877536, 0.028545740756498107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 179.38888888888889, 114, 353, 116.5, 347.6, 353.0, 353.0, 0.08084219603334292, 0.03512284645372233, 0.045350928113322794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 115.9, 114, 118, 116.0, 117.9, 118.0, 118.0, 0.050110242533573865, 0.03724013141411105, 0.02515299283423532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 189.8, 117, 357, 123.0, 356.7, 357.0, 357.0, 0.050269191520592775, 0.03956735191952908, 0.017869126673335713], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 694.0769230769231, 115, 1421, 759.0, 1285.0, 1421.0, 1421.0, 0.1142274708280613, 0.02216417947332349, 0.07773337276377759], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1631.0000000000002, 1036, 2893, 1545.0, 2734.0, 2882.5, 2893.0, 0.09675635827497236, 0.05007897449778843, 0.04450414526124217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 255.8, 231, 461, 233.0, 438.5000000000001, 461.0, 461.0, 0.050023761286611144, 0.07752705972837097, 0.11250461156549361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ba43429-2f27-4913-aeb7-d9f259303a48", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9a4abce-ecdc-411d-9ae7-25c96b2e1d0e", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b66f5ef7-78f1-4f69-9049-5798914ca8df", 3, 0, 0.0, 1288.6666666666667, 232, 2553, 1081.0, 2553.0, 2553.0, 2553.0, 0.02738925610780411, 0.027469498069057446, 0.017564073741007196], "isController": false}, {"data": ["addBook", 57, 4, 7.017543859649122, 1219.9298245614034, 597, 2712, 1007.0, 1979.0000000000005, 2497.4999999999986, 2712.0, 0.28004461061516467, 95.14579937690075, 1.0168937602253132], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a8f4db31-a263-4656-869b-36c5c0a31a63", 3, 0, 0.0, 399.0, 218, 554, 425.0, 554.0, 554.0, 554.0, 0.02699613955204406, 0.02707522980463794, 0.017311977512215755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4578e49-afdb-4d1e-a81b-34b7882213d9", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 193.12280701754395, 114, 470, 116.0, 461.4, 465.29999999999995, 470.0, 0.26204005075302034, 0.1947387486553208, 0.12666975109643075], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 728.6842105263157, 559, 1141, 680.0, 910.0, 1030.1999999999996, 1141.0, 0.2618077596145455, 76.98017416244483, 0.13167089472801846], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 191.63157894736847, 113, 455, 119.0, 346.6, 356.29999999999984, 455.0, 0.2624889478337754, 0.46448239597148544, 0.12765575783322283], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1079.7543859649122, 786, 1474, 1029.0, 1355.8, 1368.2999999999997, 1474.0, 0.2614007410940309, 235.2088463298992, 0.1312109188694647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 118.47058823529412, 115, 126, 118.0, 123.6, 126.0, 126.0, 0.11382505758208795, 0.08503532133818094, 0.04046125093738283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b1c166a-ea50-426d-b244-a31e4a9a9155", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 4, 2.3391812865497075, 193.98830409356717, 115, 1078, 122.0, 351.80000000000007, 436.60000000000014, 988.0000000000001, 0.7202304737516005, 1.6040494800441405, 0.3448471932070894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 163.28571428571428, 118, 349, 137.0, 349.0, 349.0, 349.0, 0.033377041363690546, 0.025847650196686136, 0.011864495172249374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 119.66666666666667, 115, 133, 119.0, 129.4, 133.0, 133.0, 0.08196318213858335, 0.06651504331754177, 0.02913534990082455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7daa3b49-4717-4b9c-9444-6997807df4d2", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 284.42857142857144, 229, 580, 236.0, 580.0, 580.0, 580.0, 0.033291322854493134, 0.051595048212969355, 0.07487296536513448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cb8fe17-6368-4fd8-86f1-579ca5f9ad09", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 464.83333333333326, 229, 1402, 237.5, 1357.9, 1402.0, 1402.0, 0.0807971990304336, 10.851477634886434, 0.17941782532094444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 143.39999999999998, 115, 345, 118.0, 260.40000000000003, 345.0, 345.0, 0.07707525113685995, 0.06390321114765049, 0.027397843177555687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 125.42857142857142, 117, 166, 120.0, 158.0, 166.0, 166.0, 0.0713390336618326, 0.0553852849230048, 0.025358797121979554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cee15dd-b515-426b-b259-ead8060432fd", 3, 0, 0.0, 1124.3333333333333, 291, 2311, 771.0, 2311.0, 2311.0, 2311.0, 0.02111516209406101, 0.024957406758963387, 0.013540647566829487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 115.94117647058822, 113, 119, 116.0, 118.2, 119.0, 119.0, 0.1121268484440751, 0.08332864420502065, 0.056282421972904874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 195.70588235294122, 113, 351, 115.0, 348.6, 351.0, 351.0, 0.11196069521005803, 0.03984998090082258, 0.06329946933923432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 241.35294117647058, 114, 1357, 116.0, 544.9999999999993, 1357.0, 1357.0, 0.11196143257945969, 5.954466324717791, 0.06525509506842819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 261.11764705882354, 112, 1019, 117.0, 478.99999999999955, 1019.0, 1019.0, 0.11212906715211957, 1.9678367870734974, 0.06546229948684462], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.4622496147919877], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15408320493066255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.11111111111111, 0.15408320493066255], "isController": false}, {"data": ["401/Unauthorized", 8, 44.44444444444444, 0.6163328197226502], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 18, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
