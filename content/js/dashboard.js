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

    var data = {"OkPercent": 96.58573596358119, "KoPercent": 3.4142640364188166};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7726683937823834, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.32456140350877194, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c58ed55-9e9c-44ad-a68d-6a880c0bda5c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e724e554-4ec7-4520-a367-7bb2ec14d443"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4542703-7427-40f5-b14b-e064fde8a1c2"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1f2da7a-83d2-49a2-9681-d98af8a05db6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fc6e57a-3069-4f70-9582-5de3c8d2b3fa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7f8164ea-bd93-434b-8881-bc26c06c30a2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.68, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c38d6c7-e062-47ea-a858-a5ab7c7b6084"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f68148b-0dd7-415e-ba09-ca6eec3a2fba"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a493827-ac5c-4e62-8833-12cd2f0b2e3a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7bd6894-3877-4209-8463-a3d0ceac8f51"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bc10c0d-d5d6-491b-b6af-785accbc1d9f"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3471c4d4-6c83-43e6-bcbe-d8c2df32f02a"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "register"], "isController": true}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f49e52d-cbe8-4246-ad5b-dff1ee37ef8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c38d6c7-e062-47ea-a858-a5ab7c7b6084"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e724e554-4ec7-4520-a367-7bb2ec14d443"], "isController": false}, {"data": [0.3113207547169811, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fc6e57a-3069-4f70-9582-5de3c8d2b3fa"], "isController": false}, {"data": [0.7543859649122807, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c58ed55-9e9c-44ad-a68d-6a880c0bda5c"], "isController": false}, {"data": [0.9049079754601227, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa9c6f08-239a-4380-adce-7fdd4f5049f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3471c4d4-6c83-43e6-bcbe-d8c2df32f02a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f68148b-0dd7-415e-ba09-ca6eec3a2fba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1f2da7a-83d2-49a2-9681-d98af8a05db6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4bc10c0d-d5d6-491b-b6af-785accbc1d9f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c7bd6894-3877-4209-8463-a3d0ceac8f51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4542703-7427-40f5-b14b-e064fde8a1c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a493827-ac5c-4e62-8833-12cd2f0b2e3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1318, 45, 3.4142640364188166, 324.38239757207845, 81, 2617, 94.0, 913.2000000000003, 1099.5499999999986, 1571.62, 5.318762560431312, 785.5484521475311, 3.8940726240102985], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1420.3157894736842, 1024, 1920, 1415.0, 1690.6000000000001, 1841.6999999999996, 1920.0, 0.25166118457361086, 302.8332320387867, 1.2374160784454402], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c58ed55-9e9c-44ad-a68d-6a880c0bda5c", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 0.6361410651408451, 2.4276518485915495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e724e554-4ec7-4520-a367-7bb2ec14d443", 3, 0, 0.0, 396.0, 187, 546, 455.0, 546.0, 546.0, 546.0, 0.03677507140493032, 0.030657863889331553, 0.023582972222562733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4542703-7427-40f5-b14b-e064fde8a1c2", 3, 0, 0.0, 284.6666666666667, 190, 472, 192.0, 472.0, 472.0, 472.0, 0.06204243702692642, 0.03988730896099599, 0.03978632843198081], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 497.5, 85, 1342, 489.0, 1149.5000000000002, 1342.0, 1342.0, 0.0956794737628943, 0.020702132232022726, 0.0636013884736134], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 497.5, 85, 1342, 489.0, 1149.5000000000002, 1342.0, 1342.0, 0.09500115782661102, 0.02055536526460791, 0.06315048888486453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 114.58823529411765, 83, 259, 85.0, 257.4, 259.0, 259.0, 0.09888377666226536, 0.04393193524275967, 0.055417631268213516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 105.82352941176471, 82, 252, 86.0, 251.2, 252.0, 252.0, 0.09897646688946075, 0.07355575322546838, 0.04968154685662385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 197.47058823529412, 81, 748, 85.0, 681.5999999999999, 748.0, 748.0, 0.09897761941358672, 3.4473868452921588, 0.057283979526188314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 202.35294117647058, 83, 917, 85.0, 913.8, 917.0, 917.0, 0.09897704314816863, 10.50115270047218, 0.0571869887399058], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 178.8235294117647, 84, 322, 187.0, 322.0, 322.0, 322.0, 0.09034143749169657, 0.13615048326026305, 0.05837837950046499], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1f2da7a-83d2-49a2-9681-d98af8a05db6", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 86.57142857142856, 84, 93, 86.0, 88.8, 92.6, 93.0, 0.1026408011847681, 0.07627895478672707, 0.05152087090719805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 108.57142857142857, 84, 251, 85.0, 247.6, 250.7, 251.0, 0.10264330961132401, 0.034806315740595915, 0.058128265645773045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 603.4545454545454, 414, 670, 659.0, 669.6, 670.0, 670.0, 0.06635700066357, 19.51116145487724, 0.03784422694094227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 916.9090909090909, 659, 1083, 910.0, 1080.0, 1083.0, 1083.0, 0.06622795662670913, 59.59203178904289, 0.037705955774776784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 191.0, 84, 260, 247.0, 258.8, 260.0, 260.0, 0.06659079352011042, 0.1178344900961329, 0.03687205070888927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 122.66666666666667, 83, 254, 86.0, 254.0, 254.0, 254.0, 0.05078777481829263, 0.03774364905929755, 0.025493082281838293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 120.88888888888889, 83, 248, 85.0, 248.0, 248.0, 248.0, 0.05078834802433326, 0.022065597383835765, 0.02849129332528244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 194.22222222222223, 83, 741, 85.0, 741.0, 741.0, 741.0, 0.05078892124331279, 5.08994158039604, 0.02937336699510169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 167.44444444444446, 82, 665, 85.0, 665.0, 665.0, 665.0, 0.05078834802433326, 1.6714414473832715, 0.029422633474600186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 115.36363636363636, 83, 251, 86.0, 251.0, 251.0, 251.0, 0.06658998728736606, 0.04948728547430232, 0.037391838564683096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 130.95238095238096, 81, 884, 85.0, 220.2000000000001, 820.799999999999, 884.0, 0.10264280791620436, 4.424356565534989, 0.05992270324497906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 508.1578947368422, 83, 1572, 86.0, 1006.0, 1572.0, 1572.0, 0.13327254234910393, 56.82258010600428, 0.0729245212709992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 128.47619047619045, 83, 665, 85.0, 250.8, 623.5999999999995, 665.0, 0.10264230622598904, 1.46350248846496, 0.060022646986226384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 340.94736842105266, 83, 755, 85.0, 746.0, 755.0, 755.0, 0.1332744120143375, 18.581217711643276, 0.07305569511373919], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 438.875, 85, 985, 446.5, 908.7, 985.0, 985.0, 0.09518880103755793, 0.020595965556527276, 0.06350761621957678], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0fc6e57a-3069-4f70-9582-5de3c8d2b3fa", 3, 0, 0.0, 283.6666666666667, 171, 468, 212.0, 468.0, 468.0, 468.0, 0.04793634053976319, 0.030818448100921977, 0.030740426713324706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f8164ea-bd93-434b-8881-bc26c06c30a2", 1, 0, 0.0, 1064.0, 1064, 1064, 1064.0, 1064.0, 1064.0, 1064.0, 0.9398496240601504, 0.30012776080827064, 0.5607891799812029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 318.6666666666667, 168, 995, 174.0, 995.0, 995.0, 995.0, 0.050763425515953815, 6.817788033086472, 0.11272498949479111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 638.52, 93, 1156, 569.0, 1047.0, 1125.1, 1156.0, 0.11856601518593522, 0.07283010112495435, 0.05360943850692188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 86.47368421052632, 84, 91, 86.0, 89.0, 91.0, 91.0, 0.13326973794961003, 0.09904127986294259, 0.06689516143173783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 137.68421052631578, 83, 259, 85.0, 253.0, 259.0, 259.0, 0.13327254234910393, 0.13047776452846072, 0.07070513888401782], "isController": false}, {"data": ["login", 25, 0, 0.0, 2823.28, 1108, 4343, 2793.0, 4079.6000000000004, 4300.7, 4343.0, 0.11573216798755648, 61.072285480300074, 0.25905470399183395], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 97.61904761904762, 86, 253, 90.0, 95.8, 237.29999999999978, 253.0, 0.10224749737077864, 0.0827765383988042, 0.03634579008101897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c38d6c7-e062-47ea-a858-a5ab7c7b6084", 1, 0, 0.0, 985.0, 985, 985, 985.0, 985.0, 985.0, 985.0, 1.0152284263959392, 0.1834152918781726, 0.6999524111675127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f68148b-0dd7-415e-ba09-ca6eec3a2fba", 3, 0, 0.0, 375.0, 219, 584, 322.0, 584.0, 584.0, 584.0, 0.03293265272517701, 0.02745459753553982, 0.02111892118118448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 596.1578947368422, 169, 1659, 177.0, 1093.0, 1659.0, 1659.0, 0.1331903289801126, 75.5864016398183, 0.2834059636846053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a493827-ac5c-4e62-8833-12cd2f0b2e3a", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7bd6894-3877-4209-8463-a3d0ceac8f51", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bc10c0d-d5d6-491b-b6af-785accbc1d9f", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 10, 47.61904761904762, 581.3809523809524, 84, 1320, 745.0, 1153.4, 1304.9999999999998, 1320.0, 0.12343356922859895, 77.36639785578257, 0.18473707180307056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 359.3529411764706, 169, 1170, 333.0, 1031.6, 1170.0, 1170.0, 0.09883433621115664, 14.045768337039622, 0.21930571604023139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3471c4d4-6c83-43e6-bcbe-d8c2df32f02a", 3, 0, 0.0, 347.0, 202, 625, 214.0, 625.0, 625.0, 625.0, 0.03783149850565581, 0.02432200831662442, 0.02426043361202537], "isController": false}, {"data": ["register", 26, 11, 42.30769230769231, 991.0384615384614, 95, 2617, 945.5, 1686.6000000000001, 2335.949999999999, 2617.0, 0.10522098430183853, 0.032549580330151075, 0.04747274877680606], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 250.66666666666669, 170, 969, 175.0, 338.0, 905.8999999999991, 969.0, 0.10259767542981098, 5.996315033490813, 0.22949454919314258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 108.23529411764706, 85, 255, 87.0, 253.4, 255.0, 255.0, 0.13106766175291434, 0.10175663192731141, 0.046590457888731264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f49e52d-cbe8-4246-ad5b-dff1ee37ef8b", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.0470030737704918, 1.9563268442622952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 203.3125, 169, 342, 172.0, 338.5, 342.0, 342.0, 0.08277717419421594, 0.1282884525841999, 0.18616780485281184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 88.14285714285714, 86, 96, 87.0, 96.0, 96.0, 96.0, 0.03817751453472518, 0.028372156797779158, 0.019163322725438223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 83.85714285714286, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.03817855565069894, 0.010215746336222178, 0.02177370751953924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 84.71428571428571, 84, 86, 85.0, 86.0, 86.0, 86.0, 0.03817834742296155, 0.010290257703845106, 0.022444692527952004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 83.85714285714286, 82, 85, 84.0, 85.0, 85.0, 85.0, 0.03817855565069894, 0.01029031382772745, 0.022482098688839318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 87.4, 85, 91, 87.0, 91.0, 91.0, 91.0, 0.04172090384166082, 0.012304407187677315, 0.025790363409932914], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1001.9298245614034, 660, 1554, 930.0, 1337.2, 1493.8999999999996, 1554.0, 0.25968345953038297, 310.6716981760654, 0.5127733937211273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, 42.30769230769231, 991.0384615384614, 95, 2617, 945.5, 1686.6000000000001, 2335.949999999999, 2617.0, 0.10798911801964572, 0.03340588852200278, 0.048721652856519845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 84.5, 83, 86, 84.5, 86.0, 86.0, 86.0, 0.027947793521701462, 0.007532803722646098, 0.016457538567955062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 84.0, 81, 87, 84.0, 87.0, 87.0, 87.0, 0.02794759825327511, 0.0075327510917030565, 0.016430131004366813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 104.29411764705884, 82, 254, 84.0, 251.6, 254.0, 254.0, 0.13458523995756608, 0.03627492795731273, 0.07912140083442849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 143.3529411764706, 82, 257, 86.0, 253.8, 257.0, 257.0, 0.13458630544757863, 0.036275215140167676, 0.07925345916493155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c38d6c7-e062-47ea-a858-a5ab7c7b6084", 3, 0, 0.0, 320.6666666666667, 179, 545, 238.0, 545.0, 545.0, 545.0, 0.053832902670111975, 0.034118704914944016, 0.03452175073571634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 84.75, 84, 85, 85.0, 85.0, 85.0, 85.0, 0.027947793521701462, 0.007478218188424024, 0.015938975992845366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 96.52941176470588, 84, 249, 86.0, 129.7999999999999, 249.0, 249.0, 0.13476341094120353, 0.10015132395142175, 0.06764491525759629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 87.5, 84, 90, 88.0, 90.0, 90.0, 90.0, 0.02794642670001607, 0.02076877999874241, 0.014027796214656503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 94.4705882352941, 81, 258, 84.0, 122.79999999999988, 258.0, 258.0, 0.13476341094120353, 0.03605974081825172, 0.07685725780240513], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 385.18750000000006, 84, 625, 482.5, 596.3000000000001, 625.0, 625.0, 0.09610417692778972, 0.019972822414497316, 0.0653853308236128], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 176.0, 91, 255, 179.0, 255.0, 255.0, 255.0, 0.0280117929648382, 0.02204834485318319, 0.009957317030469828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1422.8000000000002, 759, 2338, 1386.0, 1769.2, 2168.7999999999997, 2338.0, 0.11767585479740925, 0.060906448283815334, 0.05412629649373023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 174.25, 171, 179, 173.5, 179.0, 179.0, 179.0, 0.02792964522368155, 0.04328549508787364, 0.06281442670911973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e724e554-4ec7-4520-a367-7bb2ec14d443", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["addBook", 53, 14, 26.41509433962264, 881.2452830188685, 431, 2357, 751.0, 1529.0, 1628.8999999999999, 2357.0, 0.25313553736376054, 75.36403998496709, 0.9189083067262411], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 152.61403508771926, 82, 364, 86.0, 342.0, 345.29999999999995, 364.0, 0.2604690270339432, 0.19357122028596757, 0.1259103206853534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fc6e57a-3069-4f70-9582-5de3c8d2b3fa", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 558.3684210526317, 401, 770, 500.0, 750.2, 755.2, 770.0, 0.26042142583015043, 76.57254599921873, 0.13097366631106197], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 122.33333333333331, 81, 263, 86.0, 255.2, 259.4, 263.0, 0.2608146568685769, 0.46151968578697394, 0.12684150304741337], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 847.7894736842105, 567, 1203, 831.0, 1080.0, 1149.1, 1203.0, 0.2601326219999179, 234.0677905399007, 0.13057438252730252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 103.74999999999999, 85, 262, 88.0, 177.30000000000007, 262.0, 262.0, 0.08406231118816823, 0.06280045708881708, 0.029881524680169174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c58ed55-9e9c-44ad-a68d-6a880c0bda5c", 3, 0, 0.0, 425.6666666666667, 322, 504, 451.0, 504.0, 504.0, 504.0, 0.07627183281214248, 0.03540482864261562, 0.048911299036432515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 14, 8.588957055214724, 145.25153374233125, 83, 1008, 90.0, 299.6, 420.5999999999997, 695.0399999999928, 0.6869665999367822, 1.6355955642187334, 0.3242792513960594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 90.0, 86, 103, 88.0, 103.0, 103.0, 103.0, 0.03949558495782436, 0.03058593639800265, 0.014039446215476627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa9c6f08-239a-4380-adce-7fdd4f5049f4", 2, 0, 0.0, 237.0, 206, 268, 237.0, 268.0, 268.0, 268.0, 0.01895788505834289, 0.032398729347753966, 0.0117838807027688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 99.3529411764706, 85, 254, 88.0, 129.9999999999999, 254.0, 254.0, 0.10246395679637398, 0.0831519024392449, 0.03642273464246106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3471c4d4-6c83-43e6-bcbe-d8c2df32f02a", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 174.0, 171, 182, 173.0, 182.0, 182.0, 182.0, 0.03815982424675232, 0.05914027449179291, 0.08582233910182677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 251.29411764705878, 170, 504, 175.0, 379.9999999999999, 504.0, 504.0, 0.13449473492670036, 0.2084405706334702, 0.302481811070499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f68148b-0dd7-415e-ba09-ca6eec3a2fba", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1f2da7a-83d2-49a2-9681-d98af8a05db6", 3, 0, 0.0, 288.6666666666667, 180, 500, 186.0, 500.0, 500.0, 500.0, 0.021579473604707203, 0.025506207245667923, 0.01383839941447695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bc10c0d-d5d6-491b-b6af-785accbc1d9f", 3, 0, 0.0, 768.0, 213, 1561, 530.0, 1561.0, 1561.0, 1561.0, 0.02019753186160651, 0.023872798889809, 0.012952193283647407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7bd6894-3877-4209-8463-a3d0ceac8f51", 3, 0, 0.0, 960.0, 204, 2185, 491.0, 2185.0, 2185.0, 2185.0, 0.03492514377517521, 0.029115655341218655, 0.022396657954783582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 109.44444444444444, 87, 252, 88.0, 252.0, 252.0, 252.0, 0.04938515482246037, 0.0409453090276063, 0.01755487925329646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4542703-7427-40f5-b14b-e064fde8a1c2", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 121.68421052631578, 84, 336, 92.0, 255.0, 336.0, 336.0, 0.1234912938637826, 0.09587458849776091, 0.04389729586564147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a493827-ac5c-4e62-8833-12cd2f0b2e3a", 3, 0, 0.0, 284.0, 183, 474, 195.0, 474.0, 474.0, 474.0, 0.023178552113111334, 0.023246458027505214, 0.014863850150660588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 85.375, 84, 89, 85.0, 87.6, 89.0, 89.0, 0.08281702096823448, 0.06154663374690083, 0.041570262478195834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 95.25000000000001, 83, 253, 84.0, 138.90000000000012, 253.0, 253.0, 0.0828153063389941, 0.022159564391488657, 0.04723060439645758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 106.375, 83, 254, 85.0, 252.6, 254.0, 254.0, 0.08281444905099818, 0.02232108197077685, 0.04868583821162197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 106.0, 83, 252, 85.0, 250.6, 252.0, 252.0, 0.0828153063389941, 0.022321313036682007, 0.04876721652579438], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 24.444444444444443, 0.834597875569044], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.11111111111111, 0.37936267071320184], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.11111111111111, 0.37936267071320184], "isController": false}, {"data": ["401/Unauthorized", 24, 53.333333333333336, 1.8209408194233687], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1318, 45, "401/Unauthorized", 24, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
