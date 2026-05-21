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

    var data = {"OkPercent": 98.60573199070488, "KoPercent": 1.39426800929512};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8187290969899665, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4017857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ba20302-7530-4953-9240-428344ffbf4c"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e80b1d0-57f2-4367-93d5-31ff60bda643"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f95ea39c-0299-40ca-8a2f-3b2f0b158c0e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b8e01c0-3da1-41d6-8258-b270dd738690"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d01b02c-faab-4920-b059-25efeea57a69"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e6dbf89-ce71-4e56-a67c-158f8c89b650"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=943833ec-ac41-4189-9388-09d4638a9682"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e6605e9-f28c-4f97-ada1-77c0a0bf8084"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/84eed5ab-b521-4772-a099-b982320e2e6e"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/900aaeff-0430-49c5-94a5-88e0782b9614"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df211094-dd75-48ca-8ea1-f7ad4295102b"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f971edb2-acb7-4d1a-833f-35c6d9e3fba8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/943833ec-ac41-4189-9388-09d4638a9682"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77502108-6215-48b8-8051-5c75ffca54e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d01b02c-faab-4920-b059-25efeea57a69"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b8e01c0-3da1-41d6-8258-b270dd738690"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8392857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9482758620689655, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8e80b1d0-57f2-4367-93d5-31ff60bda643"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef1d9eba-13d5-4821-84ca-1f15f40bb9b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f95ea39c-0299-40ca-8a2f-3b2f0b158c0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e6dbf89-ce71-4e56-a67c-158f8c89b650"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84eed5ab-b521-4772-a099-b982320e2e6e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=900aaeff-0430-49c5-94a5-88e0782b9614"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4e6605e9-f28c-4f97-ada1-77c0a0bf8084"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df211094-dd75-48ca-8ea1-f7ad4295102b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f971edb2-acb7-4d1a-833f-35c6d9e3fba8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1291, 18, 1.39426800929512, 303.36405886909347, 77, 3080, 94.0, 820.5999999999999, 1026.7999999999997, 1650.3199999999997, 5.056558250297675, 706.1673674942325, 3.7063567076753148], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1326.4107142857144, 961, 1781, 1281.5, 1653.8000000000002, 1747.9, 1781.0, 0.24239066449669308, 291.6778286530654, 1.1918330036531735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ba20302-7530-4953-9240-428344ffbf4c", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.1697287087912087, 2.185639880952381], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 645.6666666666666, 83, 2010, 533.0, 1656.9000000000012, 2010.0, 2010.0, 0.07465100654440492, 0.014197542504416853, 0.05044167540187126], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 645.6666666666666, 83, 2010, 533.0, 1656.9000000000012, 2010.0, 2010.0, 0.07568017557800734, 0.014393275579899344, 0.05113708478387003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 149.44444444444443, 78, 239, 82.0, 238.1, 239.0, 239.0, 0.13960847578568547, 0.049005362322774804, 0.07896907381410356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 106.8888888888889, 80, 239, 81.0, 236.3, 239.0, 239.0, 0.13977976920806998, 0.10387930113998167, 0.07016289196576948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 155.22222222222223, 78, 469, 81.0, 340.3000000000002, 469.0, 469.0, 0.13951433509793132, 2.3145058818856135, 0.08148933005991366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 168.33333333333331, 78, 1026, 81.0, 317.7000000000011, 1026.0, 1026.0, 0.1397830256812481, 7.023194578457106, 0.08150976345605766], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 262.00000000000006, 79, 782, 200.5, 655.4000000000004, 782.0, 782.0, 0.07462965036008808, 0.18075583121882657, 0.048240829493015905], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 98.44444444444444, 80, 240, 81.0, 236.4, 240.0, 240.0, 0.1279781583943007, 0.09510876810357699, 0.06423903653776422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 123.66666666666667, 79, 237, 80.5, 236.1, 237.0, 237.0, 0.12784000113635557, 0.03420718780406389, 0.0729087506480778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 559.8, 465, 632, 612.0, 632.0, 632.0, 632.0, 0.043561216577656575, 12.808444042350214, 0.024843506329444768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 742.2, 549, 871, 738.0, 871.0, 871.0, 871.0, 0.04345861001981713, 39.10413368791937, 0.024742548478079475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 176.6, 79, 243, 236.0, 243.0, 243.0, 243.0, 0.04364639437136098, 0.07723365878994735, 0.024167485945861013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 92.69230769230771, 79, 235, 81.0, 174.59999999999997, 235.0, 235.0, 0.07284178204618169, 0.05413339466517995, 0.036563160128649796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 92.23076923076921, 78, 236, 80.0, 174.39999999999995, 236.0, 236.0, 0.07284259835151596, 0.027906944981425135, 0.04107245667266217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 164.9230769230769, 79, 867, 80.0, 615.7999999999997, 867.0, 867.0, 0.07277857398781798, 5.055514000428274, 0.042304732986608744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 149.15384615384616, 78, 664, 81.0, 493.59999999999985, 664.0, 664.0, 0.072778166550035, 1.664199177746676, 0.04237556857942617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 83.0, 80, 92, 81.0, 92.0, 92.0, 92.0, 0.04370820402989641, 0.03248236647143669, 0.024543180973818787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 672.2666666666667, 80, 1098, 939.0, 1093.8, 1098.0, 1098.0, 0.07773108155026869, 46.63535952892373, 0.04124403090069595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 124.05555555555556, 79, 238, 80.5, 237.1, 238.0, 238.0, 0.12783636944710772, 0.03445589645254075, 0.07515380313199105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e80b1d0-57f2-4367-93d5-31ff60bda643", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 410.3333333333333, 79, 712, 469.0, 673.6, 712.0, 712.0, 0.07773148436042535, 15.244075241485811, 0.041320154284041205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 114.94444444444446, 77, 238, 80.5, 237.1, 238.0, 238.0, 0.12797906831238268, 0.034494358256071896, 0.07536267401598316], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 510.41666666666663, 87, 898, 444.5, 877.9000000000001, 898.0, 898.0, 0.07569640694388373, 0.014396362551095075, 0.051739430494928344], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 270.9230769230769, 159, 947, 164.0, 757.3999999999999, 947.0, 947.0, 0.07274477216896931, 6.798532304274595, 0.1621729720296351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f95ea39c-0299-40ca-8a2f-3b2f0b158c0e", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 0.22498637920298878, 0.8585966687422166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b8e01c0-3da1-41d6-8258-b270dd738690", 3, 0, 0.0, 409.0, 207, 660, 360.0, 660.0, 660.0, 660.0, 0.022779043280182234, 0.03140275009491268, 0.014607654707668945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 738.9473684210526, 275, 1862, 602.0, 1471.0, 1862.0, 1862.0, 0.09072546950430468, 0.05572882843574965, 0.04102137927782526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.39999999999999, 79, 89, 82.0, 87.2, 89.0, 89.0, 0.07772866477699646, 0.05776515028837334, 0.039016146186890796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 145.13333333333333, 79, 253, 83.0, 247.0, 253.0, 253.0, 0.07773108155026869, 0.09863143095148025, 0.039978876578588715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d01b02c-faab-4920-b059-25efeea57a69", 1, 0, 0.0, 898.0, 898, 898, 898.0, 898.0, 898.0, 898.0, 1.1135857461024499, 0.20118492483296213, 0.7677651726057906], "isController": false}, {"data": ["login", 19, 0, 0.0, 2776.78947368421, 1611, 4068, 2888.0, 3927.0, 4068.0, 4068.0, 0.08773914689842116, 27.74272050088663, 0.1706665303438913], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 102.61111111111111, 81, 252, 84.5, 243.0, 252.0, 252.0, 0.12725254681833287, 0.1030198840941386, 0.045234303751829255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e6dbf89-ce71-4e56-a67c-158f8c89b650", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=943833ec-ac41-4189-9388-09d4638a9682", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 756.0000000000001, 160, 1179, 1021.0, 1175.4, 1179.0, 1179.0, 0.07769605304050553, 62.00779853899047, 0.16148740190873304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e6605e9-f28c-4f97-ada1-77c0a0bf8084", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84eed5ab-b521-4772-a099-b982320e2e6e", 3, 0, 0.0, 602.3333333333334, 510, 782, 515.0, 782.0, 782.0, 782.0, 0.016148045279118964, 0.022261384035504168, 0.010355354557247511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 329.3888888888889, 161, 1107, 316.5, 620.1000000000008, 1107.0, 1107.0, 0.1394257209471654, 9.470835515894532, 0.31158985987715043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 621.4285714285714, 79, 952, 788.0, 952.0, 952.0, 952.0, 0.06079924956354824, 51.95967652627831, 0.10943525639912102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/900aaeff-0430-49c5-94a5-88e0782b9614", 3, 0, 0.0, 355.3333333333333, 263, 454, 349.0, 454.0, 454.0, 454.0, 0.019553910130229044, 0.02695664368539062, 0.012539454087419015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df211094-dd75-48ca-8ea1-f7ad4295102b", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1241.090909090909, 431, 3080, 1055.5, 2053.1, 2929.2499999999977, 3080.0, 0.08973365419912714, 0.028232960802708325, 0.04048530101562182], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f971edb2-acb7-4d1a-833f-35c6d9e3fba8", 3, 0, 0.0, 243.33333333333331, 166, 395, 169.0, 395.0, 395.0, 395.0, 0.03287022833851952, 0.026717760469167726, 0.021078889917605294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 267.1666666666667, 161, 476, 318.0, 472.4, 476.0, 476.0, 0.12776287210936502, 0.19800749808355692, 0.287341693816277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 93.60000000000001, 81, 242, 83.0, 148.40000000000006, 242.0, 242.0, 0.10514583727630222, 0.08163177796353543, 0.03737605934431056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 208.05555555555554, 160, 323, 165.0, 321.2, 323.0, 323.0, 0.08599849024872674, 0.13328086330539973, 0.19341262015900165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 101.375, 81, 241, 81.5, 241.0, 241.0, 241.0, 0.04280661576246609, 0.03181233847191083, 0.02148691455264411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 99.5, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.042807073868956845, 0.027527791154988362, 0.023514627979773658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 308.62500000000006, 80, 896, 157.5, 896.0, 896.0, 896.0, 0.04280684481448584, 9.638071889413867, 0.02424606444570487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 254.875, 79, 628, 157.5, 628.0, 628.0, 628.0, 0.042807073868956845, 3.1553286446210236, 0.024287997966663994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 897.142857142857, 622, 1422, 859.5, 1260.0, 1348.3, 1422.0, 0.25262208187662116, 302.22383557009135, 0.49882993120559377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1241.090909090909, 431, 3080, 1055.5, 2053.1, 2929.2499999999977, 3080.0, 0.08747410567667185, 0.027522037510486954, 0.03946585627209218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 97.00000000000001, 79, 236, 80.5, 221.10000000000005, 236.0, 236.0, 0.04730301840560446, 0.012749641679635578, 0.027855195408769035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 81.59999999999998, 78, 88, 80.5, 87.9, 88.0, 88.0, 0.047302794649107874, 0.012749581370267356, 0.027808869510510682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 121.19999999999999, 78, 237, 80.0, 236.4, 237.0, 237.0, 0.10761791336040522, 0.029006390710421718, 0.06326756234664448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 112.2, 79, 246, 80.0, 241.2, 246.0, 246.0, 0.10773694946418823, 0.029038474660269483, 0.06344275442080616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 128.6, 78, 240, 84.0, 239.7, 240.0, 240.0, 0.04730234714246521, 0.012657073356479948, 0.02697711985468719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 102.0, 78, 239, 81.0, 239.0, 239.0, 239.0, 0.1077354018530489, 0.08006507891618186, 0.054078121633268694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 81.7, 80, 87, 80.5, 86.9, 87.0, 87.0, 0.04730413721984125, 0.03515473478935468, 0.023744459502928125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 101.06666666666666, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.10773772328643151, 0.02882825798875218, 0.06144417031179297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 101.29999999999998, 81, 242, 83.5, 228.10000000000005, 242.0, 242.0, 0.04921041882987466, 0.03873398200867088, 0.017492766068432006], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 539.6666666666667, 79, 1239, 474.0, 1109.4000000000005, 1239.0, 1239.0, 0.07613633479684288, 0.014306542728345558, 0.051817070955891685], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/943833ec-ac41-4189-9388-09d4638a9682", 3, 0, 0.0, 288.3333333333333, 178, 494, 193.0, 494.0, 494.0, 494.0, 0.077780658542909, 0.03519372245268343, 0.04987887282862328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1494.5263157894738, 915, 2170, 1479.0, 2135.0, 2170.0, 2170.0, 0.0906047629493281, 0.04689504332338271, 0.041674651708138215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77502108-6215-48b8-8051-5c75ffca54e3", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 211.8, 161, 326, 168.5, 325.3, 326.0, 326.0, 0.04728400665758814, 0.07328097516171131, 0.10634283919182176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d01b02c-faab-4920-b059-25efeea57a69", 3, 0, 0.0, 393.6666666666667, 283, 612, 286.0, 612.0, 612.0, 612.0, 0.021357025393503194, 0.0252432809908236, 0.013695748706120212], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 871.0169491525422, 410, 1812, 723.0, 1568.0, 1719.0, 1812.0, 0.2691409386176191, 77.42576635316308, 0.9803089832060615], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b8e01c0-3da1-41d6-8258-b270dd738690", 1, 0, 0.0, 831.0, 831, 831, 831.0, 831.0, 831.0, 831.0, 1.203369434416366, 0.21740561070998798, 0.829666817087846], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 128.41071428571422, 79, 332, 81.5, 321.6, 325.45, 332.0, 0.2532515692552595, 0.18820746504223876, 0.12242141287241548], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 505.9285714285715, 389, 739, 469.5, 630.6, 701.0, 739.0, 0.2531714241796794, 74.4408047912692, 0.1273274252466161], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 133.46428571428575, 78, 369, 86.5, 242.0, 247.3, 369.0, 0.25357839874297566, 0.44871490090065613, 0.12332230720117371], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 766.589285714286, 542, 1185, 758.5, 990.1000000000001, 1089.2, 1185.0, 0.25303872396186344, 227.6846886155167, 0.12701357823866974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 100.55555555555554, 81, 243, 84.5, 162.0000000000001, 243.0, 243.0, 0.08480805111098547, 0.06335757724599989, 0.030146611918358115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 146.20114942528747, 80, 605, 88.0, 272.5, 379.75, 571.25, 0.7351356832325691, 1.5558259502896181, 0.3537873482726424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 84.74999999999999, 82, 91, 84.0, 91.0, 91.0, 91.0, 0.04258989128930248, 0.0329822107347821, 0.015139375419244244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e80b1d0-57f2-4367-93d5-31ff60bda643", 3, 0, 0.0, 721.6666666666666, 176, 1558, 431.0, 1558.0, 1558.0, 1558.0, 0.03921466105461295, 0.025211248562129095, 0.025147422616402185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 93.94444444444443, 80, 252, 83.0, 118.80000000000021, 252.0, 252.0, 0.13694878115584772, 0.11113714564502876, 0.048681012051492736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 410.75, 162, 978, 240.0, 978.0, 978.0, 978.0, 0.04278807068589277, 12.847086884520346, 0.09349444156219247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef1d9eba-13d5-4821-84ca-1f15f40bb9b0", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f95ea39c-0299-40ca-8a2f-3b2f0b158c0e", 3, 0, 0.0, 315.6666666666667, 197, 429, 321.0, 429.0, 429.0, 429.0, 0.037946823850843685, 0.024396151401502694, 0.024334388992891292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 256.53333333333336, 159, 485, 171.0, 479.6, 485.0, 485.0, 0.10755463775598004, 0.16668868175658236, 0.24189290112502151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e6dbf89-ce71-4e56-a67c-158f8c89b650", 3, 0, 0.0, 436.0, 250, 807, 251.0, 807.0, 807.0, 807.0, 0.026258435522411572, 0.02633536453273114, 0.016838905592171487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.15384615384616, 81, 99, 83.0, 98.6, 99.0, 99.0, 0.07213045625287828, 0.05980347398309927, 0.025640123121140324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84eed5ab-b521-4772-a099-b982320e2e6e", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=900aaeff-0430-49c5-94a5-88e0782b9614", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 121.99999999999999, 81, 311, 85.0, 270.8, 311.0, 311.0, 0.0766119146849718, 0.05947897673296151, 0.02723314154817357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e6605e9-f28c-4f97-ada1-77c0a0bf8084", 3, 0, 0.0, 948.3333333333334, 188, 1418, 1239.0, 1418.0, 1418.0, 1418.0, 0.01975542780378909, 0.027234452066747006, 0.012668682543445478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df211094-dd75-48ca-8ea1-f7ad4295102b", 3, 0, 0.0, 250.33333333333334, 186, 361, 204.0, 361.0, 361.0, 361.0, 0.01795364369198729, 0.02122059903828315, 0.011513241560291328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f971edb2-acb7-4d1a-833f-35c6d9e3fba8", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 81.88888888888887, 79, 89, 81.0, 89.0, 89.0, 89.0, 0.08603178396463138, 0.06393573007527781, 0.04318392281037161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 106.72222222222223, 78, 239, 81.0, 239.0, 239.0, 239.0, 0.0860326063578096, 0.023020443498085772, 0.04906547081343829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 116.22222222222221, 78, 240, 81.0, 240.0, 240.0, 240.0, 0.08603219515925514, 0.02318836510151799, 0.05057752098229649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 98.27777777777779, 78, 240, 80.0, 236.4, 240.0, 240.0, 0.08603219515925514, 0.02318836510151799, 0.0506615367978817], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.46475600309837334], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07745933384972889], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07745933384972889], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.774593338497289], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1291, 18, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
